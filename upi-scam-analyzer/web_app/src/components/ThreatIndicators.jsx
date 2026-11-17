import { Lock, Globe, AlertTriangle, LinkIcon } from './Icons';

/**
 * ThreatIndicators Component
 * Displays 4 structured technical forensic checks.
 * Uses design system tokens:
 * Background: #111C2E, Border: #26364D, Primary: #F1F5F9, Secondary: #A8B5C7, Muted: #8291A6.
 */
export default function ThreatIndicators({ indicators = {}, type = 'url' }) {
  const isUrl = type === 'url';
  const isPhone = type === 'phone';
  const isMessage = type === 'message' || type === 'sms';
  const isUpi = type === 'upi';

  const card1 = {
    title: isPhone ? 'Network Routing' : isMessage ? 'Channel Encryption' : isUpi ? 'Payment Rail' : 'SSL / TLS Protocol',
    value: indicators.sslStatus || (isUrl ? 'Active (HTTPS)' : 'Standard Rail'),
    status: indicators.sslState || 'safe',
    icon: <Lock className="w-3.5 h-3.5" />,
    desc: isUrl
      ? (indicators.sslState === 'danger' ? 'Missing encryption. Traffic submitted in plaintext.' : 'HTTPS encryption actively verified.')
      : isUpi
      ? 'Verified NPCI payment rail standard.'
      : 'Transport protocol verified.',
  };

  const card2 = {
    title: isPhone ? 'Telecom Prefix' : isMessage ? 'Urgency Analysis' : isUpi ? 'PSP Bank Routing' : 'Domain Reputation',
    value: indicators.domainAge || (isUrl ? 'Recognized Host' : 'Standard Format'),
    status: indicators.domainState || 'safe',
    icon: <Globe className="w-3.5 h-3.5" />,
    desc: isUrl
      ? (indicators.domainState === 'danger' ? 'Raw IP address or typo-squatting pattern.' : 'Established domain with recognized history.')
      : isPhone
      ? 'Telecommunication carrier prefix check.'
      : isUpi
      ? 'Bank PSP handle syntax check.'
      : 'Evaluated against urgency keywords.',
  };

  const card3 = {
    title: 'Threat Signatures',
    value: indicators.threatSignatures || '0 Flagged Patterns',
    status: indicators.signatureState || 'safe',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    desc: indicators.signatureState === 'danger'
      ? 'Matched known scam or impersonation syntax.'
      : indicators.signatureState === 'warning'
      ? 'Unusual behavioral patterns detected.'
      : 'No known malicious patterns found.',
  };

  const card4 = {
    title: isPhone ? 'Caller Identity' : isMessage ? 'Link Analysis' : isUpi ? 'Handle Structure' : 'Redirect Chain',
    value: indicators.redirectObfuscation || 'Direct Routing',
    status: indicators.redirectState || 'safe',
    icon: <LinkIcon className="w-3.5 h-3.5" />,
    desc: indicators.redirectState === 'danger'
      ? 'Masked destination or spoofed identity.'
      : indicators.redirectState === 'warning'
      ? 'URL shortener or redirect hop detected.'
      : 'Transparent direct destination.',
  };

  const cards = [card1, card2, card3, card4];

  function getBadge(status) {
    if (status === 'danger') {
      return {
        badge: 'bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/40',
        text: 'FLAGGED',
      };
    }
    if (status === 'warning') {
      return {
        badge: 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40',
        text: 'CAUTION',
      };
    }
    return {
      badge: 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40',
      text: 'PASS',
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const b = getBadge(c.status);
        return (
          <div
            key={i}
            className="p-3.5 rounded-lg bg-[#111C2E] border border-[#26364D] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[#8291A6]">
                  {c.icon}
                </span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${b.badge}`}>
                  {b.text}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-[#8291A6] uppercase tracking-wide">
                {c.title}
              </div>
              <div className="text-xs font-mono font-medium text-[#F1F5F9] mt-0.5 truncate" title={c.value}>
                {c.value}
              </div>
            </div>
            <p className="text-[11px] text-[#A8B5C7] mt-2 border-t border-[#26364D] pt-2 leading-relaxed">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
