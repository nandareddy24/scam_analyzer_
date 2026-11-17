import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2, FileText } from '../components/Icons';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-[#0F172A] border-b border-[#26364D] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2 text-[#F1F5F9] hover:text-[#3B82F6] transition-colors">
              <div className="w-7 h-7 rounded-md bg-[#3B82F6] text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight">UPI Scam Analyzer</span>
            </Link>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#A8B5C7] hover:text-[#F1F5F9] bg-[#111C2E] hover:bg-[#16243B] px-3 py-1.5 rounded-md border border-[#26364D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Console</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-[#111C2E] border border-[#26364D] rounded-lg p-6 sm:p-8 space-y-7">
          {/* Header */}
          <div className="border-b border-[#26364D] pb-5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0F172A] text-[#3B82F6] border border-[#26364D] text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Compliance & Data Protection</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-[#8291A6] text-xs font-mono mt-1">
              Effective Date: November 17, 2026 | Last Updated: November 17, 2026
            </p>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">1. Overview and Purpose</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              UPI Scam Analyzer operates as an independent cyber safety utility dedicated to helping individuals and organizations verify digital payment identifiers, URLs, phone numbers, and communication snippets before financial transactions occur. This Privacy Policy describes how we collect, handle, store, and safeguard your information in accordance with applicable Indian data protection principles and standard security practices.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-[#F1F5F9]">2. Information We Process</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              We practice strict data minimization. Depending on how you interact with our utility, we process the following categories of information:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#080F1D] border border-[#26364D] rounded-md">
                <strong className="text-[#F1F5F9] block uppercase tracking-wide mb-0.5">A. Analysis Input Data</strong>
                <p className="text-[#A8B5C7] leading-relaxed">
                  UPI Virtual Payment Addresses (VPAs), web URLs, phone numbers, SMS or messaging text snippets, and uploaded screenshot images submitted specifically for fraud pattern analysis.
                </p>
              </div>
              <div className="p-3 bg-[#080F1D] border border-[#26364D] rounded-md">
                <strong className="text-[#F1F5F9] block uppercase tracking-wide mb-0.5">B. Account Identifiers</strong>
                <p className="text-[#A8B5C7] leading-relaxed">
                  When you create an account, we collect your verified email address and encrypted password hash solely to provide authenticated session management and personal scan audit logs.
                </p>
              </div>
              <div className="p-3 bg-[#080F1D] border border-[#26364D] rounded-md">
                <strong className="text-[#F1F5F9] block uppercase tracking-wide mb-0.5">C. Technical & Diagnostic Logs</strong>
                <p className="text-[#A8B5C7] leading-relaxed">
                  Standard HTTP request headers, timestamps, browser user agent strings, and anonymized error traces required for system reliability, performance monitoring, and anti-abuse controls.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How Information Is Used */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">3. How We Use Collected Data</h2>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#A8B5C7] list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-[#F1F5F9]">Heuristic Fraud Evaluation:</strong> Evaluating submitted text and identifiers against recognized fraud indicators, suspicious domain registries, and known scam syntax.
              </li>
              <li>
                <strong className="text-[#F1F5F9]">Personal Scan Audit:</strong> Enabling signed-in users to review past scan timestamps, inputs, and risk verdicts in their personal account history.
              </li>
              <li>
                <strong className="text-[#F1F5F9]">Threat Intelligence:</strong> Compiling aggregated, non-personally identifiable blacklist statistics to protect other users from recurring fraud campaigns.
              </li>
              <li>
                <strong className="text-[#F1F5F9]">Security and Abuse Prevention:</strong> Detecting automated denial of service attacks, scraping attempts, and misuse of public scanning endpoints.
              </li>
            </ul>
          </section>

          {/* Section 4: Data Storage and Security */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">4. Data Storage, Retention, and Security</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              All communications between your browser and our servers are transmitted using Transport Layer Security (TLS 1.3) with standard HTTPS encryption.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
              <div className="p-3 bg-[#080F1D] border border-[#26364D] rounded-md text-[#A8B5C7] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Uploaded images for OCR analysis are processed in memory and not permanently retained on external image servers.</span>
              </div>
              <div className="p-3 bg-[#080F1D] border border-[#26364D] rounded-md text-[#A8B5C7] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Passwords are hashed cryptographically using modern salted hash algorithms before storage.</span>
              </div>
            </div>
          </section>

          {/* Section 5: Cookies & Local Storage */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">5. Cookies and Local Storage</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              We do not employ third-party advertising cookies, cross-site trackers, or commercial monetization scripts. Browser LocalStorage and session cookies are utilized exclusively for essential functions:
            </p>
            <ul className="space-y-1 text-xs sm:text-sm text-[#A8B5C7] list-disc pl-5">
              <li>Persisting your authenticated user session token across page navigation.</li>
              <li>Saving UI preferences and client-side offline scan cache.</li>
            </ul>
          </section>

          {/* Section 6: Third-Party Disclosures */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">6. Third-Party Service Providers</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              We do not sell, rent, or lease personal information to third parties. Information may be processed through trusted cloud infrastructure providers strictly under enterprise confidentiality and security terms for authentication and database management.
            </p>
          </section>

          {/* Section 7: User Rights */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-[#F1F5F9]">7. Your Rights and Data Controls</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              You retain full ownership and control over your account data. At any time, you have the right to:
            </p>
            <ul className="space-y-1 text-xs sm:text-sm text-[#A8B5C7] list-disc pl-5">
              <li>Inspect your historical scan records via the Scan History console.</li>
              <li>Clear or delete past scan logs directly from your device.</li>
              <li>Request full account termination and removal of associated email records.</li>
            </ul>
          </section>

          {/* Section 8: Contact */}
          <section className="space-y-2 border-t border-[#26364D] pt-5">
            <h2 className="text-base font-semibold text-[#F1F5F9]">8. Contact Information and Inquiries</h2>
            <p className="text-[#A8B5C7] text-xs sm:text-sm leading-relaxed">
              If you have inquiries regarding this Privacy Policy, your data rights, or our technical security measures, please reach out to our privacy desk:
            </p>
            <div className="p-3.5 bg-[#080F1D] border border-[#26364D] rounded-md text-xs space-y-1 text-[#A8B5C7]">
              <p><strong className="text-[#F1F5F9]">Organization:</strong> UPI Scam Analyzer Privacy & Information Security</p>
              <p><strong className="text-[#F1F5F9]">Email:</strong> privacy@scamanalyzer.internal</p>
              <p><strong className="text-[#F1F5F9]">National Cyber Crime Helpline:</strong> 1930 (Indian Cyber Crime Coordination Centre)</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
