import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2, FileText, Info } from '../components/Icons';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 text-[#0F172A] hover:text-[#2563EB] transition-colors">
              <div className="w-8 h-8 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-[#14243A] tracking-tight">UPI Scam Analyzer</span>
            </Link>
          </div>
          <Link
            to="/"
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
            <span>Back to Console</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-5 sm:px-6 py-10 w-full">
        <article className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="border-b border-[#E2E8F0] pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Privacy &amp; Data Practices</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-[#64748B] text-xs font-mono mt-1.5">
              Last Updated: November 17, 2026
            </p>
            <p className="text-[#475569] text-[15px] mt-3 leading-relaxed">
              This Privacy Policy explains what data UPI Scam Analyzer collects, how scanning inputs and account details are processed and stored, which third-party services are used, and what controls you have over your data.
            </p>
          </div>

          {/* 1. Scope */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#0F172A]">1. Scope and Product Architecture</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              UPI Scam Analyzer is an independent web utility that uses client-side heuristic rules to inspect suspicious URLs, SMS or chat messages, UPI Virtual Payment Addresses (VPAs), phone numbers, and QR/screenshot payloads. The application is not affiliated with any bank, payment aggregator, NPCI, RBI, or government agency.
            </p>
          </section>

          {/* 2. Data Collected */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">2. Information Collected and Processed</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              We process only the information you actively enter or submit while using the application:
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <strong className="text-[#0F172A] block uppercase tracking-wide text-xs mb-1">A. Scan Inputs and Uploaded Files</strong>
                <p className="text-[#475569] leading-relaxed">
                  URLs, SMS/message text, UPI VPAs, phone numbers, decoded UPI intent URIs, and image file metadata submitted into scanner forms. Please remove personal account numbers, passwords, PINs, or real OTPs before pasting text into any scanner.
                </p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <strong className="text-[#0F172A] block uppercase tracking-wide text-xs mb-1">B. Account Registration Details</strong>
                <p className="text-[#475569] leading-relaxed">
                  When you create an account or sign in, your email address and password are processed by Google Firebase Authentication to establish your account and maintain your signed-in session.
                </p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <strong className="text-[#0F172A] block uppercase tracking-wide text-xs mb-1">C. Email Verification (OTP)</strong>
                <p className="text-[#475569] leading-relaxed">
                  During sign-up, your email address is sent to the application OTP server solely to generate and email a temporary 6-digit verification code. The OTP server does not receive or store your account password.
                </p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <strong className="text-[#0F172A] block uppercase tracking-wide text-xs mb-1">D. Fraud Entity Reports</strong>
                <p className="text-[#475569] leading-relaxed">
                  If you use the Fraud Entity Reporting page, the category, reported identifier, incident description, and optional evidence notes you enter are saved in your browser local storage for session tracking.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Processing & Storage */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">3. How Information Is Processed and Stored</h2>
            <ul className="space-y-2.5 text-[15px] text-[#475569] list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-[#0F172A]">Client-Side Heuristic Processing:</strong> All URL, message, UPI VPA, phone number, and QR/OCR payload checks execute locally in your browser using deterministic rule checks. Inputs are not sent to external third-party threat-intelligence APIs or AI models.
              </li>
              <li>
                <strong className="text-[#0F172A]">Browser Local Storage:</strong> Recent scan results (up to 50 records under key <code className="font-mono text-xs bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#0F172A]">scam_analyzer_scan_history</code>) and submitted fraud reports (up to 50 records under key <code className="font-mono text-xs bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#0F172A]">scam_analyzer_submitted_reports</code>) are stored locally in your browser.
              </li>
              <li>
                <strong className="text-[#0F172A]">Cloud Firestore (Authenticated Users):</strong> When you are signed in with a Firebase account, scan records may also be written to your user-scoped Cloud Firestore collection (<code className="font-mono text-xs bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#0F172A]">users/&#123;uid&#125;/scans</code>) to support persistent scan history.
              </li>
              <li>
                <strong className="text-[#0F172A]">Image Uploads:</strong> Image files selected in the QR/Screenshot module are inspected only for file type, size, and filename in browser memory and are not uploaded to remote file storage.
              </li>
            </ul>
          </section>

          {/* 4. Data Retention */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">4. Data Retention</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm pt-1">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                <div className="font-semibold text-[#0F172A]">Temporary Email OTPs</div>
                <p className="text-[#475569] leading-relaxed">
                  Held in OTP server memory for up to 5 minutes and deleted immediately upon verification, expiration, or after 5 failed attempts.
                </p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                <div className="font-semibold text-[#0F172A]">Browser Local Storage</div>
                <p className="text-[#475569] leading-relaxed">
                  Retained on your device until you clear Audit History / Submitted Reports inside the app or clear your browser site data.
                </p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                <div className="font-semibold text-[#0F172A]">Firebase Account Records</div>
                <p className="text-[#475569] leading-relaxed">
                  Account credentials and any synced Firestore scan records remain active until account deletion or manual removal by the administrator.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">5. Third-Party Services</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              We do not sell, rent, or trade user data, and we do not embed third-party advertising trackers. The application relies on the following external services to operate:
            </p>
            <ul className="space-y-2 text-[15px] text-[#475569] list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-[#0F172A]">Google Firebase (Authentication &amp; Cloud Firestore):</strong> Manages account sign-up, login sessions, and optional user-scoped scan history storage under Google Cloud and Firebase privacy terms.
              </li>
              <li>
                <strong className="text-[#0F172A]">Gmail SMTP (via Nodemailer):</strong> Used by the OTP backend server exclusively to deliver 6-digit sign-up verification emails.
              </li>
              <li>
                <strong className="text-[#14243A]">Google Fonts &amp; Tailwind CSS CDN:</strong> Loaded by your browser to render typography (<code className="font-mono text-xs bg-[#F5F7FA] px-1.5 py-0.5 rounded text-[#172B4D]">Inter</code>, <code className="font-mono text-xs bg-[#F5F7FA] px-1.5 py-0.5 rounded text-[#172B4D]">JetBrains Mono</code>) and interface styles. Standard browser request metadata (such as IP address and User-Agent) is visible to those CDNs when assets load.
              </li>
            </ul>
          </section>

          {/* 6. Security Measures & Limitations */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">6. Security Practices and Limitations</h2>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#475569] flex items-start gap-3">
              <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Authentication is delegated to Firebase Authentication, and rule-based scans run locally in your browser to minimize data transmission. However, no web application or local storage mechanism can guarantee absolute security. Do not enter sensitive banking credentials, UPI PINs, or private identity numbers into scanner inputs, and avoid using shared public devices without clearing local history.
              </p>
            </div>
          </section>

          {/* 7. User Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">7. Your Rights and Data Controls</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              You can manage and remove your data using the controls provided in the application:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#334155] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Inspect, filter, or permanently clear local scan logs at any time from the Audit History page.</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#334155] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Clear locally saved fraud entity reports directly from the Fraud Entity Reporting page.</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#334155] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Sign out at any time from the sidebar to terminate your active Firebase session on the device.</span>
              </div>
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#334155] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span>Request deletion of your Firebase account and associated Firestore scan records by contacting the project administrator.</span>
              </div>
            </div>
          </section>

          {/* 8. Policy Updates & Official Cybercrime Reporting */}
          <section className="space-y-2.5 border-t border-[#E2E8F0] pt-6">
            <h2 className="text-lg font-bold text-[#0F172A]">8. Updates and Official Cybercrime Reporting</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              We may update this Privacy Policy when application features or storage practices change. Material updates will be reflected by updating the Last Updated date at the top of this page.
            </p>
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-sm space-y-1.5 text-[#166534]">
              <p className="leading-relaxed">
                <strong className="text-[#14532D]">Official Financial Fraud Reporting (India):</strong>{' '}
                If you have experienced unauthorized financial debit or cyber fraud, contact the National Cyber Crime Helpline at{' '}
                <strong className="text-[#15803D] font-mono">1930</strong> or file a complaint on the National Cyber Crime Reporting Portal at{' '}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:text-[#1D4ED8] underline font-mono font-semibold"
                >
                  https://cybercrime.gov.in
                </a>{' '}
                (operated by the Indian Cyber Crime Coordination Centre, Ministry of Home Affairs, Government of India).
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
