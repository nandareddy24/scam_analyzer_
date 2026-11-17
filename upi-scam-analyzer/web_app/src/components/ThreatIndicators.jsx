import { Lock, Globe, AlertTriangle, LinkIcon } from './Icons';

/**
 * ThreatIndicators Component
 * Displays 4 structured supporting technical evidence cards.
 */
export default function ThreatIndicators({ indicators = {}, type = 'url' }) {
  const normalized = String(type || 'url').toLowerCase();
  const isUrl = normalized === 'url';
  const isPhone = normalized === 'phone';
  const isMessage = normalized === 'message' || normalized === 'sms';
  const isUpi = normalized === 'upi';
  const isOcr = normalized === 'ocr' || normalized === 'qr';

  const card1 = {
    title: isUrl
      ? 'Protocol Scheme'
      : isPhone
      ? 'Number Format'
      : isMessage
      ? 'Channel Context'
      : isUpi
      ? 'Payment Rail'
      : 'Payload Check',
    value: indicators.sslStatus || (isUrl ? 'Scheme Checked' : 'Standard Format'),
    status: indicators.sslState || 'safe',
    icon: <Lock className="w-4 h-4" />,
    desc: isUrl
      ? indicators.sslState === 'danger'
        ? 'Link uses plaintext HTTP or is malformed.'
        : 'URL uses the HTTPS protocol scheme.'
      : isPhone
      ? 'Evaluates basic telecommunication digit structure.'
      : isUpi
      ? 'Checked against standard UPI VPA syntax rules.'
      : isOcr
      ? 'Evaluates extracted QR or screenshot payload text.'
      : 'Evaluates text message structure and sender cues.',
  };

  const card2 = {
    title: isUrl
      ? 'Host & Domain Pattern'
      : isPhone
      ? 'Prefix & Carrier Pool'
      : isMessage
      ? 'Urgency Signals'
      : isUpi
      ? 'PSP Handle Registry'
      : 'Payload Source',
    value: indicators.domainAge || (isUrl ? 'Standard Host' : 'Standard Pattern'),
    status: indicators.domainState || 'safe',
    icon: <Globe className="w-4 h-4" />,
    desc: isUrl
      ? indicators.domainState === 'danger'
        ? 'Raw IP host, link shortener, or hyphenated typo pattern flagged.'
        : 'No raw IP, shortener, or multi-hyphen host pattern detected.'
      : isPhone
      ? 'Checks international prefixes, telemarketing pools, and synthetic patterns.'
      : isUpi
      ? 'Compares the @handle suffix against recognized Indian bank/PSP handles.'
      : isOcr
      ? 'Inspects uploaded filename or decoded UPI intent structure.'
      : 'Checks for all-caps bursts, repeated exclamation marks, or urgency cues.',
  };

  const card3 = {
    title: 'Heuristic Signatures',
    value: indicators.threatSignatures || '0 Pattern Flags',
    status: indicators.signatureState || 'safe',
    icon: <AlertTriangle className="w-4 h-4" />,
    desc:
      indicators.signatureState === 'danger'
        ? 'High-risk scam keywords or flagged list entries matched.'
        : indicators.signatureState === 'warning'
        ? 'Suspicious heuristic pattern indicators were triggered.'
        : 'No known scam keywords or flagged entries matched.',
  };

  const card4 = {
    title: isUrl
      ? 'Redirect & Routing'
      : isPhone
      ? 'Caller ID Pattern'
      : isMessage
      ? 'Embedded Links'
      : isUpi
      ? 'VPA Structure'
      : 'Intent Routing',
    value: indicators.redirectObfuscation || 'Direct Structure',
    status: indicators.redirectState || 'safe',
    icon: <LinkIcon className="w-4 h-4" />,
    desc:
      indicators.redirectState === 'danger'
        ? 'Malformed structure or spoofed pattern detected.'
        : indicators.redirectState === 'warning'
        ? 'External link or redirect obfuscation pattern detected.'
        : 'No redirect masking or structural anomaly detected.',
  };

  const cards = [card1, card2, card3, card4];

  function getBadge(status) {
    if (status === 'danger') {
      return {
        badge: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]',
        dot: 'bg-[#DC2626]',
        text: 'DANGEROUS',
      };
    }
    if (status === 'warning') {
      return {
        badge: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
        dot: 'bg-[#D97706]',
        text: 'WARNING',
      };
    }
    return {
      badge: 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]',
      dot: 'bg-[#16A34A]',
      text: 'SAFE',
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const b = getBadge(c.status);
        return (
          <div
            key={i}
            className="card-enterprise p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-[#64748B] flex items-center justify-center">
                  {c.icon}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase px-2 py-0.5 rounded-md ${b.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
                  {b.text}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                {c.title}
              </div>
              <div
                className="text-[13.5px] font-mono font-semibold text-[#172B4D] mt-1 truncate"
                title={c.value}
              >
                {c.value}
              </div>
            </div>
            <p className="text-xs text-[#64748B] mt-3 border-t border-[#E2E8F0] pt-2.5 leading-relaxed">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
