// Pure, offline, rule-based heuristic scam analysis engine.
// Evaluates text, URL, UPI VPA, phone number, and QR/OCR payload patterns locally (0-25 score).
// Results represent rule-based indicators, not guarantees of safety or legal determinations of fraud.

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function calculateVerdict(score) {
  let status = 'NO INDICATORS DETECTED';
  let badgeClass = 'safe';
  let riskLevel = 'low';

  if (score >= 12) {
    status = 'HIGH RISK INDICATORS';
    badgeClass = 'danger';
    riskLevel = 'high';
  } else if (score >= 5) {
    status = 'SUSPICIOUS INDICATORS';
    badgeClass = 'warning';
    riskLevel = 'medium';
  }

  return { status, badgeClass, riskLevel };
}

const SCAM_KEYWORDS = {
  otp: 6,
  kyc: 6,
  blocked: 5,
  suspend: 5,
  'verify your account': 6,
  'verify immediately': 6,
  lottery: 8,
  winner: 6,
  prize: 5,
  cashback: 4,
  refund: 4,
  'click here': 5,
  'click the link': 5,
  urgent: 4,
  'act now': 5,
  'bank account will be': 6,
  'update your details': 4,
  'lucky draw': 6,
  'free gift': 4,
  debited: 3,
  'reward point': 4,
  'expire today': 5,
  congratulations: 4,
  electricity: 5,
  bill: 4,
  pan: 5,
  aadhaar: 5,
};

export function analyzeMessage(message) {
  const text = (message || '').toLowerCase();
  let rawScore = 0;
  const reasons = [];

  for (const [keyword, weight] of Object.entries(SCAM_KEYWORDS)) {
    if (text.includes(keyword)) {
      rawScore += weight;
      reasons.push(`Contains suspicious phrase: "${keyword}".`);
    }
  }

  const hasLink = /https?:\/\/|www\./.test(text);
  if (hasLink) {
    rawScore += 5;
    reasons.push('Contains an embedded external link. Fraudulent messages often direct recipients to phishing URLs.');
  }

  const hasOtpSolicitation = /\b\d{4,}\b/.test(text) && text.includes('otp');
  if (hasOtpSolicitation) {
    rawScore += 5;
    reasons.push('Mentions OTP alongside a numeric code. Never share OTPs with anyone.');
  }

  const hasUrgency = (message || '').includes('!!!') || /[A-Z]{6,}/.test(message || '') || text.includes('urgent') || text.includes('expire');
  if (hasUrgency) {
    rawScore += 3;
    reasons.push('Uses urgency markers (ALL CAPS bursts, repeated exclamation marks, or immediate deadline wording).');
  }

  const score = clamp(rawScore, 0, 25);
  const verdict = calculateVerdict(score);

  if (reasons.length === 0) {
    reasons.push('No local SMS scam keywords, embedded links, or urgency markers were triggered.');
  }

  const advice = verdict.riskLevel === 'high'
    ? 'Multiple high-risk message indicators were matched. Do not click links, enter UPI PINs, or share OTPs. If you experienced financial loss, call National Cyber Crime Helpline 1930 or report at cybercrime.gov.in.'
    : verdict.riskLevel === 'medium'
    ? 'Suspicious message indicators were matched. Verify the sender through an official bank or service contact before acting.'
    : 'No local scam rules were triggered. This is not a guarantee of authenticity; banks never ask for OTPs or UPI PINs over SMS.';

  const indicators = {
    sslStatus: 'SMS / Text Input',
    sslValid: true,
    sslState: 'safe',
    domainAge: hasUrgency ? 'Urgency Cues Present' : 'Standard Tone',
    domainState: hasUrgency ? 'warning' : 'safe',
    threatSignatures: hasOtpSolicitation ? 'OTP Keyword + Digits' : reasons.length > 1 ? `${reasons.length} Rule Matches` : '0 Rule Matches',
    signatureState: hasOtpSolicitation ? 'danger' : reasons.length > 1 ? (score >= 12 ? 'danger' : 'warning') : 'safe',
    redirectObfuscation: hasLink ? 'External Link Detected' : 'No Web Links Embedded',
    redirectState: hasLink ? 'warning' : 'safe',
  };

  return {
    type: 'message',
    input: message,
    score,
    result: verdict.riskLevel === 'high' ? 'High-Risk Message Indicators' : verdict.riskLevel === 'medium' ? 'Suspicious Message Indicators' : 'No Message Indicators Detected',
    ...verdict,
    reasons,
    findings: reasons.join(' '),
    advice,
    indicators,
  };
}

const UPI_SUSPICIOUS_WORDS = [
  'refund', 'cashback', 'kyc', 'verify', 'support', 'helpdesk',
  'lottery', 'reward', 'bonus', 'winner', 'customer', 'care',
];

const KNOWN_VALID_HANDLES = [
  'okaxis', 'oksbi', 'okhdfcbank', 'okicici', 'ybl', 'ibl', 'axl', 'paytm',
  'apl', 'upi', 'jio', 'fbl', 'idfcbank', 'postbank', 'barodampay', 'kvb',
];

export function analyzeUpiId(upiId) {
  const id = (upiId || '').trim().toLowerCase();
  let rawScore = 0;
  const reasons = [];

  const upiRegex = /^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/;
  if (!upiRegex.test(id)) {
    return {
      type: 'upi',
      input: upiId,
      score: 22,
      result: 'Invalid UPI Handle Format',
      status: 'HIGH RISK INDICATORS',
      badgeClass: 'danger',
      riskLevel: 'high',
      reasons: ['Does not follow standard UPI VPA structure (username@bankhandle).'],
      findings: 'Invalid handle structure. Standard UPI IDs follow username@bankhandle format.',
      advice: 'Do not send money to malformed or unverified payment handles.',
      indicators: {
        sslStatus: 'UPI VPA Syntax Check',
        sslValid: false,
        sslState: 'danger',
        domainAge: 'Malformed / Missing Handle',
        domainState: 'danger',
        threatSignatures: 'Format Rule Violation',
        signatureState: 'danger',
        redirectObfuscation: 'Invalid VPA Structure',
        redirectState: 'danger',
      },
    };
  }

  const handle = id.split('@').pop();
  const isRegisteredHandle = KNOWN_VALID_HANDLES.some((h) => handle.includes(h));
  if (!isRegisteredHandle) {
    rawScore += 7;
    reasons.push(`Bank/PSP suffix "@${handle}" is not in the local list of major Indian UPI handles.`);
  }

  let hasLureWord = false;
  for (const word of UPI_SUSPICIOUS_WORDS) {
    if (id.includes(word)) {
      rawScore += 8;
      reasons.push(`UPI handle contains common impersonation keyword: "${word}".`);
      hasLureWord = true;
    }
  }

  const namePart = id.split('@')[0];
  const isNumericUsername = /^\d+$/.test(namePart);
  if (isNumericUsername) {
    rawScore += 6;
    reasons.push('Username before @ is purely numeric, which can appear in automated or temporary accounts.');
  }

  if (namePart.length <= 3) {
    rawScore += 4;
    reasons.push('Unusually short username before the @ symbol.');
  }

  const score = clamp(rawScore, 0, 25);
  const verdict = calculateVerdict(score);

  if (reasons.length === 0) {
    reasons.push('No local UPI impersonation keywords or syntax issues were triggered.');
  }

  const advice = verdict.riskLevel === 'high'
    ? 'High-risk handle indicators were matched. Do not approve collect requests or send funds without verifying the recipient independently.'
    : verdict.riskLevel === 'medium'
    ? 'Unusual UPI handle pattern detected. Confirm the recipient identity and legal account name inside your payment app before paying.'
    : 'No local red flags were triggered. This check cannot confirm live bank account ownership; always verify the beneficiary name displayed in your UPI app.';

  const indicators = {
    sslStatus: 'UPI VPA Syntax Check',
    sslValid: true,
    sslState: 'safe',
    domainAge: isRegisteredHandle ? `Recognized Suffix (@${handle})` : `Unlisted Suffix (@${handle})`,
    domainState: isRegisteredHandle ? 'safe' : 'warning',
    threatSignatures: hasLureWord ? 'Lure Keyword Matched' : isNumericUsername ? 'Numeric-Only Alias' : '0 Keyword Matches',
    signatureState: hasLureWord ? 'danger' : isNumericUsername ? 'warning' : 'safe',
    redirectObfuscation: 'Standard VPA Structure',
    redirectState: 'safe',
  };

  return {
    type: 'upi',
    input: upiId,
    score,
    result: verdict.riskLevel === 'high' ? 'High-Risk UPI Indicators' : verdict.riskLevel === 'medium' ? 'Suspicious UPI Indicators' : 'No UPI Indicators Detected',
    ...verdict,
    reasons,
    findings: reasons.join(' '),
    advice,
    indicators,
  };
}

const SHORTENERS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'ow.ly', 'cutt.ly', 'rb.gy'];
const SUSPICIOUS_URL_WORDS = [
  'secure', 'verify', 'update', 'login', 'confirm', 'account', 'bank',
  'kyc', 'reward', 'bonus', 'free', 'gift', 'paytm', 'gpay', 'phonepe',
  'sbi', 'icici', 'hdfc', 'pnb', 'axis',
];

export function analyzeUrl(rawUrl) {
  const input = (rawUrl || '').trim();
  let rawScore = 0;
  const reasons = [];

  let normalized = input;
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `http://${normalized}`;
  }

  let url;
  try {
    url = new URL(normalized);
  } catch {
    url = null;
  }

  if (!url || !url.host) {
    return {
      type: 'url',
      input: rawUrl,
      score: 20,
      result: 'Invalid URL Format',
      status: 'HIGH RISK INDICATORS',
      badgeClass: 'danger',
      riskLevel: 'high',
      reasons: ['Input could not be parsed as a valid web URL.'],
      findings: 'Malformed web address.',
      advice: 'Do not click or open malformed link targets.',
      indicators: {
        sslStatus: 'Invalid URL Syntax',
        sslValid: false,
        sslState: 'danger',
        domainAge: 'Unparseable Host',
        domainState: 'danger',
        threatSignatures: 'Malformed Target',
        signatureState: 'danger',
        redirectObfuscation: 'Parse Error',
        redirectState: 'danger',
      },
    };
  }

  const isHttps = url.protocol === 'https:';
  if (!isHttps) {
    rawScore += 5;
    reasons.push('Link uses unencrypted http:// instead of https://.');
  }

  const isRawIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
  if (isRawIp) {
    rawScore += 12;
    reasons.push('Uses a raw IPv4 address instead of a domain name, a common phishing indicator.');
  }

  const isShortened = SHORTENERS.some((s) => url.hostname.includes(s));
  if (isShortened) {
    rawScore += 7;
    reasons.push('Uses a URL shortening service that obscures the final destination.');
  }

  const hyphenCount = (url.hostname.match(/-/g) || []).length;
  const hasTyposquat = hyphenCount >= 2;
  if (hasTyposquat) {
    rawScore += 5;
    reasons.push('Hostname contains multiple hyphens, a pattern often seen in lookalike domains.');
  }

  let hasKeywordLure = false;
  for (const word of SUSPICIOUS_URL_WORDS) {
    if (url.hostname.includes(word) || url.pathname.toLowerCase().includes(word)) {
      rawScore += 4;
      reasons.push(`URL hostname or path contains banking/account lure keyword: "${word}".`);
      hasKeywordLure = true;
      break;
    }
  }

  const score = clamp(rawScore, 0, 25);
  const verdict = calculateVerdict(score);

  if (reasons.length === 0) {
    reasons.push('No local URL phishing patterns, raw IPs, shorteners, or lure keywords were triggered.');
  }

  const advice = verdict.riskLevel === 'high'
    ? 'Multiple phishing URL indicators were matched. Do not open this link or enter banking credentials, card numbers, or OTPs.'
    : verdict.riskLevel === 'medium'
    ? 'Suspicious URL structure detected. Type the official website address manually in your browser instead of clicking this link.'
    : 'No local phishing URL rules were triggered. This check does not inspect live webpage content or SSL certificates; verify the domain carefully.';

  const indicators = {
    sslStatus: isHttps ? 'HTTPS Scheme Present' : 'Unencrypted HTTP Scheme',
    sslValid: isHttps,
    sslState: isHttps ? 'safe' : 'danger',
    domainAge: isRawIp ? 'Raw IPv4 Hostname' : isShortened ? 'URL Shortener Domain' : hasTyposquat ? 'Multi-Hyphen Hostname' : 'Standard Hostname Format',
    domainState: (isRawIp || isShortened || hasTyposquat) ? 'danger' : 'safe',
    threatSignatures: hasKeywordLure ? 'Phishing Keyword Matched' : reasons.length > 1 ? `${reasons.length} Rule Matches` : '0 Rule Matches',
    signatureState: hasKeywordLure || reasons.length > 1 ? (score >= 12 ? 'danger' : 'warning') : 'safe',
    redirectObfuscation: isShortened ? 'Known Shortener Domain' : isRawIp ? 'Direct IPv4 Host' : 'Direct Hostname Format',
    redirectState: (isShortened || isRawIp) ? 'warning' : 'safe',
  };

  return {
    type: 'url',
    input: rawUrl,
    score,
    result: verdict.riskLevel === 'high' ? 'High-Risk URL Indicators' : verdict.riskLevel === 'medium' ? 'Suspicious URL Indicators' : 'No URL Indicators Detected',
    ...verdict,
    reasons,
    findings: reasons.join(' '),
    advice,
    indicators,
  };
}

export function analyzePhone(phoneNumber) {
  const raw = (phoneNumber || '').trim();
  const digits = raw.replace(/\D/g, '');
  let rawScore = 0;
  const reasons = [];

  if (digits.length < 10) {
    return {
      type: 'phone',
      input: phoneNumber,
      score: 22,
      result: 'Invalid Phone Number Format',
      status: 'HIGH RISK INDICATORS',
      badgeClass: 'danger',
      riskLevel: 'high',
      reasons: ['Input contains fewer than 10 digits and does not match standard phone number length.'],
      findings: 'Incomplete or malformed phone number.',
      advice: 'Be cautious of truncated or spoofed caller identifiers.',
      indicators: {
        sslStatus: 'Incomplete Digit Count',
        sslValid: false,
        sslState: 'danger',
        domainAge: 'Malformed Format',
        domainState: 'danger',
        threatSignatures: 'Length Rule Violation',
        signatureState: 'danger',
        redirectObfuscation: 'Invalid Number Pattern',
        redirectState: 'danger',
      },
    };
  }

  const isInternationalLure = raw.startsWith('+') && !raw.startsWith('+91');
  if (isInternationalLure) {
    rawScore += 10;
    reasons.push('Uses a non-Indian international calling prefix (+other than +91), frequently seen in imposter WhatsApp and voice scams.');
  }

  const isTollOrTelemarketer = /^(140|1800|1900)/.test(digits);
  if (isTollOrTelemarketer) {
    rawScore += 4;
    reasons.push('Matches a telemarketing or toll-free number prefix (140, 1800, or 1900).');
  }

  const isSynthetic = /^(\d)\1{7,}$/.test(digits) || digits === '1234567890';
  if (isSynthetic) {
    rawScore += 12;
    reasons.push('Contains repeating or sequential placeholder digits typical of synthetic or spoofed numbers.');
  }

  const KNOWN_FLAGGED_NUMBERS = [
    '9876543210', '9123456789', '8888888888', '7000000000',
    '9911223344', '9810012345', '7890123456', '9000000000',
  ];
  const isBlacklisted = KNOWN_FLAGGED_NUMBERS.includes(digits.slice(-10));
  if (isBlacklisted) {
    rawScore += 15;
    reasons.push('Matched the local sample flagged-number watchlist (static demo list, not connected to a live government registry).');
  }

  const score = clamp(rawScore, 0, 25);
  const verdict = calculateVerdict(score);

  if (reasons.length === 0) {
    reasons.push('No local international-prefix, telemarketer, synthetic-digit, or sample watchlist rules were triggered.');
  }

  const advice = verdict.riskLevel === 'high'
    ? 'High-risk caller indicators were matched. Do not share OTPs, UPI PINs, or install remote-access apps (such as AnyDesk or TeamViewer).'
    : verdict.riskLevel === 'medium'
    ? 'Suspicious prefix or caller pattern detected. Verify the caller using an official number from your bank card or app.'
    : 'No local phone pattern flags were triggered. This check cannot confirm caller identity; never share OTPs or PINs over phone calls.';

  const indicators = {
    sslStatus: 'Valid Digit Length',
    sslValid: true,
    sslState: 'safe',
    domainAge: isInternationalLure ? 'Non-+91 International Prefix' : isSynthetic ? 'Synthetic Digit Pattern' : 'Standard Domestic Format',
    domainState: (isInternationalLure || isSynthetic) ? 'danger' : 'safe',
    threatSignatures: isBlacklisted ? 'Matched Local Watchlist' : reasons.length > 1 ? `${reasons.length} Pattern Flags` : '0 Pattern Flags',
    signatureState: isBlacklisted ? 'danger' : reasons.length > 1 ? 'warning' : 'safe',
    redirectObfuscation: isSynthetic ? 'Synthetic / Placeholder Pattern' : 'Standard Numeric Pattern',
    redirectState: isSynthetic ? 'danger' : 'safe',
  };

  return {
    type: 'phone',
    input: phoneNumber,
    score,
    result: verdict.riskLevel === 'high' ? 'High-Risk Phone Indicators' : verdict.riskLevel === 'medium' ? 'Suspicious Phone Indicators' : 'No Phone Indicators Detected',
    ...verdict,
    reasons,
    findings: reasons.join(' '),
    advice,
    indicators,
  };
}

export function analyzeOcrQr(imageName, sampleText = '') {
  const text = (sampleText || '').toLowerCase();
  if (text.includes('upi://pay') || text.includes('paytm') || text.includes('gpay')) {
    return analyzeMessage(sampleText || 'Payment request QR code payload');
  }
  return {
    type: 'ocr',
    input: imageName || 'Uploaded Image / Payload',
    score: 3,
    result: 'No Payload Indicators Detected',
    status: 'NO INDICATORS DETECTED',
    badgeClass: 'safe',
    riskLevel: 'low',
    reasons: [
      'No suspicious keywords or UPI intent patterns were matched in the provided payload text.',
      'Note: client-side inspection checks provided text/URI payloads and file metadata; it does not run automated server-side OCR on image pixels.',
    ],
    findings: 'Local heuristic check completed on provided payload text.',
    advice: 'No local rules were triggered. Always verify the recipient name and payment amount inside your UPI app before authorizing.',
    indicators: {
      sslStatus: 'Payload Input Checked',
      sslValid: true,
      sslState: 'safe',
      domainAge: 'Provided Text / Filename',
      domainState: 'safe',
      threatSignatures: '0 Keyword Matches',
      signatureState: 'safe',
      redirectObfuscation: 'No Intent Anomaly Flagged',
      redirectState: 'safe',
    },
  };
}
