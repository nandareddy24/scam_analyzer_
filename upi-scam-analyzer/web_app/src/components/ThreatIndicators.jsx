import { Lock, Globe, AlertTriangle, LinkIcon } from './Icons';

/**
 * ThreatIndicators Component
 * Modular grid of 4 categorized cybersecurity indicators:
 * 1. Protocol & Encryption
 * 2. Domain & Entity Age
 * 3. Phishing Signatures
 * 4. Obfuscation & Redirect Route
 */
export default function ThreatIndicators({ indicators = {}, type = 'url' }) {
  const isUrl = type === 'url';
  const isPhone = type === 'phone';
  const isMessage = type === 'message' || type === 'sms';
  const isUpi = type === 'upi';

  const card1 = {
    title: isPhone ? 'Telecom Routing' : isMessage ? 'Channel Encryption' : isUpi ? 'Payment Protocol' : 'SSL / TLS Encryption',
    value: indicators.sslStatus || (isUrl ? 'Active (HTTPS TLS 1.3)' : 'Verified Secure'),
    status: indicators.sslState || 'safe',
    icon: <Lock className="w-4 h-4" />,
    desc: isUrl
      ? (indicators.sslState === 'danger' ? 'Missing encryption. Traffic sent in plaintext.' : 'HTTPS encryption actively verified.')
      : isUpi
      ? 'Direct secure channel with NPCI switch.'
      : 'Standard transport encryption verified.',
  };

  const card2 = {
    title: isPhone ? 'Carrier Identification' : isMessage ? 'Urgency Analysis' : isUpi ? 'PSP Handle Registry' : 'Domain Reputation',
    value: indicators.domainAge || (isUrl ? 'Verified Authority' : 'Registered Standard'),
    status: indicators.domainState || 'safe',
    icon: <Globe className="w-4 h-4" />,
    desc: isUrl
      ? (indicators.domainState === 'danger' ? 'High typo-squatting or raw IP detected.' : 'Registered domain with recognized history.')
      : isPhone
      ? 'Telecommunication carrier routing lookup.'
      : isUpi
      ? 'Verified bank PSP network binding.'
      : 'Evaluated against pressure or threat phrasing.',
  };

  const card3 = {
    title: 'Threat Signatures',
    value: indicators.threatSignatures || '0 Phishing Signatures',
    status: indicators.signatureState || 'safe',
    icon: <AlertTriangle className="w-4 h-4" />,
    desc: indicators.signatureState === 'danger'
      ? 'Matched against known scam lures.'
      : indicators.signatureState === 'warning'
      ? 'Unusual behavioral patterns flagged.'
      : 'No malicious signatures detected.',
  };

  const card4 = {
    title: isPhone ? 'Caller Identity' : isMessage ? 'Link Analysis' : isUpi ? 'Routing Destination' : 'Redirection Risk',
    value: indicators.redirectObfuscation || 'Direct Route (No Masking)',
    status: indicators.redirectState || 'safe',
    icon: <LinkIcon className="w-4 h-4" />,
    desc: indicators.redirectState === 'danger'
      ? 'Obfuscated target or spoofed identity detected.'
      : indicators.redirectState === 'warning'
      ? 'URL shortener or redirect hop detected.'
      : 'Direct transparent routing confirmed.',
  };

  const cards = [card1, card2, card3, card4];

  function getStatusStyles(status) {
    if (status === 'danger') {
      return {
        border: 'border-red-500/30',
        badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
        iconBg: 'bg-red-500/10 text-red-400',
        statusText: 'FLAGGED',
      };
    }
    if (status === 'warning') {
      return {
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        iconBg: 'bg-amber-500/10 text-amber-400',
        statusText: 'CAUTION',
      };
    }
    return {
      border: 'border-slate-800',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      statusText: 'SECURE',
    };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const styles = getStatusStyles(c.status);
        return (
          <div
            key={i}
            className={`p-3.5 rounded-lg bg-slate-900 border ${styles.border} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`w-7 h-7 rounded flex items-center justify-center ${styles.iconBg}`}>
                  {c.icon}
                </div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${styles.badge}`}>
                  {styles.statusText}
                </span>
              </div>
              <h4 className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wide">
                {c.title}
              </h4>
              <p className="text-xs font-bold text-slate-200 font-mono mt-0.5 truncate" title={c.value}>
                {c.value}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-2 leading-relaxed">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
