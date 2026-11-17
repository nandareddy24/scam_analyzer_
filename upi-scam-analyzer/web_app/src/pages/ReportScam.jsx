import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import {
  ModuleHeader,
  ValidationBanner,
  SuccessBanner,
} from '../components/ScannerPrimitives';
import {
  getSubmittedReports,
  saveSubmittedReport,
  clearSubmittedReports,
  formatScanTimestamp,
} from '../services/scanHistory';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  Clock,
  Trash2,
  Info,
} from '../components/Icons';

const CATEGORY_META = {
  UPI: {
    label: 'UPI Virtual Payment Address (VPA)',
    placeholder: 'e.g. fake-refund-care@ybl',
    helper: 'Enter the exact UPI handle that requested money or sent a collect request.',
  },
  URL: {
    label: 'Phishing Web Link / Domain',
    placeholder: 'e.g. http://192.168.1.55/update-kyc-bank',
    helper: 'Paste the full web address or domain name without visiting it.',
  },
  SMS: {
    label: 'SMS or WhatsApp Message Sender',
    placeholder: 'e.g. VK-SBIINB or +919876543210',
    helper: 'Provide the sender header or phone number associated with the deceptive message.',
  },
  PHONE: {
    label: 'Phone Caller ID',
    placeholder: 'e.g. +92 300 1234567 or 9876543210',
    helper: 'Include country code if the call originated from an international or VoIP prefix.',
  },
};

export default function ReportScam() {
  const location = useLocation();
  const [type, setType] = useState('UPI');
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('');
  const [proofText, setProofText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [reports, setReports] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setReports(getSubmittedReports());
  }, []);

  useEffect(() => {
    if (location.state?.prefillType && CATEGORY_META[location.state.prefillType]) {
      setType(location.state.prefillType);
    }
    if (location.state?.prefillTarget) {
      setTarget(location.state.prefillTarget);
    }
  }, [location.state]);

  function validateForm() {
    const cleanTarget = target.trim();
    const cleanReason = reason.trim();

    if (!cleanTarget) {
      return 'Enter the suspicious UPI ID, URL, SMS sender, or phone number you are reporting.';
    }
    if (cleanTarget.length < 3) {
      return 'Reported identifier is too short. Provide the complete handle, URL, or number.';
    }
    if (type === 'UPI' && !cleanTarget.includes('@')) {
      return 'A UPI VPA must include an @ symbol (for example, fake-refund@ybl).';
    }
    if (type === 'PHONE' && cleanTarget.replace(/\D/g, '').length < 7) {
      return 'Enter a valid caller ID containing at least 7 digits.';
    }
    if (!cleanReason) {
      return 'Provide a brief description of the fraud attempt so moderators have context.';
    }
    if (cleanReason.length < 15) {
      return 'Incident description is too brief. Include at least 15 characters describing what happened.';
    }
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const saved = saveSubmittedReport({
        type,
        target,
        reason,
        proofText,
      });
      setSubmittedRecord(saved);
      setReports(getSubmittedReports());
      setIsSubmitting(false);
    }, 200);
  }

  function handleResetForm() {
    setSubmittedRecord(null);
    setTarget('');
    setReason('');
    setProofText('');
    setError('');
  }

  function handleClearReports() {
    clearSubmittedReports();
    setReports([]);
    setConfirmClear(false);
  }

  const activeMeta = CATEGORY_META[type] || CATEGORY_META.UPI;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<AlertTriangle className="w-5 h-5 text-[#DC2626]" />}
          title="Fraud Entity Reporting"
          badge="Reporting Module"
          description="Submit suspicious UPI handles, phishing links, deceptive SMS senders, or caller IDs to log them for session review."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Primary Reporting Form (8 cols) */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            {submittedRecord ? (
              <div className="space-y-4">
                <SuccessBanner
                  title="Fraud Report Logged Successfully"
                  message={`Reference ${submittedRecord.id} was recorded at ${formatScanTimestamp(submittedRecord.timestamp)}.`}
                />

                <div className="p-4 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] space-y-3 text-[13.5px]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                    <span className="font-mono font-semibold text-[#172B4D]">Ref: {submittedRecord.id}</span>
                    <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-semibold text-xs uppercase">
                      {submittedRecord.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#64748B]">Category</div>
                      <div className="font-mono font-semibold text-[#172B4D] mt-0.5">{submittedRecord.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">Reported Identifier</div>
                      <div className="font-mono font-semibold text-[#172B4D] mt-0.5 break-all">{submittedRecord.target}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B]">Incident Summary</div>
                    <p className="text-[#172B4D] mt-0.5 leading-relaxed">{submittedRecord.reason}</p>
                  </div>
                  {submittedRecord.proofText && (
                    <div>
                      <div className="text-xs text-[#64748B]">Evidence Notes</div>
                      <p className="font-mono text-[#172B4D] mt-0.5">{submittedRecord.proofText}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button type="button" onClick={handleResetForm} className="btn-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Another Report</span>
                  </button>

                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <PhoneCall className="w-4 h-4 text-[#16A34A]" />
                    <span>Open Official Cyber Crime Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <ValidationBanner message={error} onDismiss={() => setError('')} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="report-category"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      Threat Category <span className="text-[#DC2626]">*</span>
                    </label>
                    <select
                      id="report-category"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                    >
                      {Object.entries(CATEGORY_META).map(([key, meta]) => (
                        <option key={key} value={key}>
                          {meta.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#64748B]">
                      Select the identifier type involved in the incident.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="report-target"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      Reported Identifier or Link <span className="text-[#DC2626]">*</span>
                    </label>
                    <input
                      id="report-target"
                      type="text"
                      value={target}
                      onChange={(e) => {
                        setTarget(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={activeMeta.placeholder}
                      className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 font-mono"
                    />
                    <p className="text-xs text-[#64748B]">{activeMeta.helper}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="report-reason"
                      className="block text-[13px] font-semibold text-[#172B4D]"
                    >
                      Incident Description <span className="text-[#DC2626]">*</span>
                    </label>
                    <span className="text-xs font-mono text-[#64748B]">
                      {reason.trim().length} chars (min 15)
                    </span>
                  </div>
                  <textarea
                    id="report-reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Describe how the scam was attempted (e.g., caller impersonated bank support and sent a collect request for INR 4,999)."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 resize-y"
                  />
                  <p className="text-xs text-[#64748B]">
                    Do not include bank passwords, PINs, card numbers, or Aadhaar/PAN details.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="report-proof"
                    className="block text-[13px] font-semibold text-[#172B4D]"
                  >
                    Evidence Notes or SMS Header (Optional)
                  </label>
                  <input
                    id="report-proof"
                    type="text"
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="e.g. SMS header VK-SBIINB, UTR reference, or WhatsApp profile name"
                    className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E2E8F0]">
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    <span>{isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    disabled={isSubmitting}
                    className="btn-secondary"
                  >
                    <RefreshCw className="w-4 h-4 text-[#64748B]" />
                    <span>Reset Form</span>
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Right Official Escalation & Scope Panel (4 cols) */}
          <aside className="xl:col-span-4 space-y-4">
            <div className="card-enterprise p-5 space-y-3 border-[#FDE68A] bg-[#FFFBEB]">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-[#92400E]">
                    Local Queue vs. Police FIR
                  </h2>
                  <p className="text-xs text-[#78350F] mt-1 leading-relaxed">
                    Submitting an entity here logs it locally in your browser session and does not freeze bank accounts or file an official police complaint.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel-navy-gradient rounded-[10px] p-5 space-y-3 text-white shadow-[0_1px_3px_rgba(20,36,58,0.12)]">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-[#4ADE80]" />
                </div>
                <span>Official Financial Fraud Escalation</span>
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                If money has already been debited from your bank account, call the National Cyber Crime Helpline immediately:
              </p>
              <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center justify-between">
                <span className="text-xs font-medium text-[#E2E8F0]">India Cyber Helpline</span>
                <span className="text-lg font-bold font-mono text-[#4ADE80]">1930</span>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-xs"
              >
                <span>File at cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </aside>
        </div>

        {/* Session Submitted Reports Table */}
        <section className="card-enterprise overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 bg-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-xs font-semibold text-[#14243A] uppercase tracking-wider">
                Submitted Reports Log
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-[11px] font-mono font-medium text-[#64748B]">
                {reports.length}
              </span>
            </div>

            {reports.length > 0 && (
              confirmClear ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleClearReports}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                  >
                    Confirm Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-[#64748B] border border-[#CBD5E1]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#DC2626] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Log</span>
                </button>
              )
            )}
          </div>

          {reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    <th className="py-2.5 px-5">Ref ID</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Reported Identifier</th>
                    <th className="py-2.5 px-4 hidden md:table-cell">Incident Summary</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-5 text-right hidden sm:table-cell">Logged At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[#F5F7FA] transition-colors">
                      <td className="py-3 px-5 font-mono text-xs text-[#64748B] whitespace-nowrap">{rep.id}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#F5F7FA] border border-[#E2E8F0] font-mono text-[11px] font-semibold text-[#172B4D]">
                          {rep.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#172B4D] max-w-[240px] truncate" title={rep.target}>
                        {rep.target}
                      </td>
                      <td className="py-3 px-4 text-[#64748B] hidden md:table-cell max-w-sm truncate" title={rep.reason}>
                        {rep.reason}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] text-[11px] font-semibold uppercase">
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-mono text-xs text-[#64748B] whitespace-nowrap hidden sm:table-cell">
                        {formatScanTimestamp(rep.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-[13px] text-[#64748B]">
              No fraud entity reports have been submitted in this browser session yet.
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
