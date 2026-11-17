import { Lock, Globe, AlertTriangle, LinkIcon, CheckCircle2 } from './Icons';

/**
 * ThreatIndicators Component
 * Modular diagnostic table / cards for key forensic parameters:
 * 1. Protocol & Encryption
 * 2. Identity & Authority
 * 3. Matched Threat Signatures
 * 4. Routing & Obfuscation
 */
export default function ThreatIndicators({ indicators = {}, type = 'url' }) {
  const isUrl = type === 'url';
  const isPhone = type === 'phone';
  const isMessage = type === 'message' || type === 'sms';
  const isUpi = type === 'upi';

  const card1 = {
    title: isPhone ? 'Network Routing' : isMessage ? 'Channel Encryption' : isUpi ? 'Payment Protocol' : 'SSL / TLS Encryption',
    value: indicators.sslStatus || (isUrl ? 'Active (HTTPS)' : 'Standard Transport'),
    status: indicators.sslState || 'safe',
    icon: <Lock className="w-3.5 h-3.5" />,
    desc: isUrl
      ? (indicators.sslState === 'danger' ? 'Missing encryption. Data submitted unencrypted.' : 'HTTPS encryption actively verified.')
      : isUpi
      ? 'NPCI payment rail protocol standard.'
      : 'Transport channel verified.',
  };

  const card2 = {
    title: isPhone ? 'Caller Origin' : isMessage ? 'Urgency Analysis' : isUpi ? 'PSP Bank Handle' : 'Domain Reputation',
    value: indicators.domainAge || (isUrl ? 'Recognized Host' : 'Standard Identifier'),
    status: indicators.domainState || 'safe',
    icon: <Globe className="w-3.5 h-3.5" />,
    desc: isUrl
      ? (indicators.domainState === 'danger' ? 'IP-based host or suspicious new domain.' : 'Standard domain with established history.')
      : isPhone
      ? 'Telecom prefix and caller ID inspection.'
      : isUpi
      ? 'Bank PSP network handle syntax verification.'
      : 'Evaluated against psychological pressure keywords.',
  };

  const card3 = {
    title: 'Threat Signatures',
    value: indicators.threatSignatures || '0 Flagged Signatures',
    status: indicators.signatureState || 'safe',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    desc: indicators.signatureState === 'danger'
      ? 'Matches known scam or impersonation syntax.'
      : indicators.signatureState === 'warning'
      ? 'Unusual behavioral patterns detected.'
      : 'No known malicious patterns found.',
  };

  const card4 = {
    title: isPhone ? 'Impersonation Risk' : isMessage ? 'Link Analysis' : isUpi ? 'Beneficiary Type' : 'Redirection Risk',
    value: indicators.redirectObfuscation || 'Direct Routing',
    status: indicators.redirectState || 'safe',
    icon: <LinkIcon className="w-3.5 h-3.5" />,
    desc: indicators.redirectState === 'danger'
      ? 'Spoofed target or masked link detected.'
      : indicators.redirectState === 'warning'
      ? 'URL shortener or redirect hop detected.'
      : 'Transparent direct destination.',
  };

  const cards = [card1, card2, card3, card4];

  function getBadge(status) {
    if (status === 'danger') {
      return {
        badge: 'bg-red-950/60 text-red-300 border-red-800',
        text: 'FLAGGED',
      };
    }
    if (status === 'warning') {
      return {
        badge: 'bg-amber-950/60 text-amber-300 border-amber-800',
        text: 'CAUTION',
      };
    }
    return {
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
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
            className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-slate-400">
                  {c.icon}
                </span>
                <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${b.badge}`}>
                  {b.text}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                {c.title}
              </div>
              <div className="text-xs font-semibold text-slate-100 mt-1 truncate" title={c.value}>
                {c.value}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2 leading-relaxed">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
