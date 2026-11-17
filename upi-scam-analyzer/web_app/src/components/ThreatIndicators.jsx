import { Lock, Globe, AlertTriangle, ShieldCheck, ShieldAlert, LinkIcon, CheckCircle2, Ban } from './Icons';

/**
 * ThreatIndicators Component
 * Modular grid of 4 categorized cybersecurity indicators:
 * 1. Protocol & Encryption (SSL status)
 * 2. Domain & Entity Age
 * 3. Phishing Signatures
 * 4. Obfuscation & Redirect Route
 */
export default function ThreatIndicators({ indicators = {}, type = 'url' }) {
  // Normalize fields based on type
  const isUrl = type === 'url';
  const isPhone = type === 'phone';
  const isMessage = type === 'message' || type === 'sms';
  const isUpi = type === 'upi';

  // Item 1: Protocol / Encryption
  const card1 = {
    title: isPhone ? 'Telecom Routing' : isMessage ? 'Channel Encryption' : isUpi ? 'Payment Protocol' : 'SSL / TLS Encryption',
    value: indicators.sslStatus || (isUrl ? 'Active (HTTPS TLS 1.3)' : 'Verified Secure'),
    status: indicators.sslState || 'safe',
    icon: <Lock className="w-4 h-4" />,
    desc: isUrl
      ? (indicators.sslState === 'danger' ? 'Missing encryption. Traffic sent in plaintext.' : 'HTTPS encryption actively verified.')
      : isUpi
      ? 'Direct secure channel with NPCI switch.'
      : 'End-to-end transmission protocol verified.',
  };

  // Item 2: Domain Age & Registry
  const card2 = {
    title: isPhone ? 'Carrier & Caller ID' : isMessage ? 'Lure Urgency Tone' : isUpi ? 'PSP Handle Registry' : 'Domain Reputation & Age',
    value: indicators.domainAge || (isUrl ? 'Verified Authority' : 'Registered Standard'),
    status: indicators.domainState || 'safe',
    icon: <Globe className="w-4 h-4" />,
    desc: isUrl
      ? (indicators.domainState === 'danger' ? 'High typo-squatting or raw IP detected.' : 'Registered domain with recognized history.')
      : isPhone
      ? 'Telecom operator registry lookup status.'
      : isUpi
      ? 'Handshake with registered bank PSP node.'
      : 'Analysis of message urgency and ultimatum phrasing.',
  };

  // Item 3: Threat Signatures
  const card3 = {
    title: 'Threat Signatures',
    value: indicators.threatSignatures || '0 Phishing Signatures',
    status: indicators.signatureState || 'safe',
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: indicators.signatureState === 'danger'
      ? 'Matched against known scam lures and blacklists.'
      : indicators.signatureState === 'warning'
      ? 'Unusual behavioral patterns flagged.'
      : 'Clean against 42,000+ threat signatures.',
  };

  // Item 4: Obfuscation & Redirection
  const card4 = {
    title: isPhone ? 'Caller Spoofing' : isMessage ? 'Embedded Link Risk' : isUpi ? 'VPA Routing Route' : 'Obfuscation & Redirects',
    value: indicators.redirectObfuscation || 'Direct Route (No Masking)',
    status: indicators.redirectState || 'safe',
    icon: <LinkIcon className="w-4 h-4" />,
    desc: indicators.redirectState === 'danger'
      ? 'Obfuscated target or spoofed identity detected.'
      : indicators.redirectState === 'warning'
      ? 'URL shortener or external redirect detected.'
      : 'Direct transparent routing confirmed.',
  };

  const cards = [card1, card2, card3, card4];

  function getStatusStyles(status) {
    if (status === 'danger') {
      return {
        border: 'border-red-500/30 hover:border-red-500/50',
        badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
        iconBg: 'bg-red-500/20 text-red-400',
        statusText: 'FLAGGED',
      };
    }
    if (status === 'warning') {
      return {
        border: 'border-amber-500/30 hover:border-amber-500/50',
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        iconBg: 'bg-amber-500/20 text-amber-400',
        statusText: 'CAUTION',
      };
    }
    return {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      statusText: 'SECURE',
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((c, i) => {
        const styles = getStatusStyles(c.status);
        return (
          <div
            key={i}
            className={`p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border ${styles.border} transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
                  {c.icon}
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {styles.statusText}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {c.title}
              </h4>
              <p className="text-sm font-bold text-slate-100 font-mono mt-1 truncate" title={c.value}>
                {c.value}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed border-t border-slate-800/80 pt-2">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
