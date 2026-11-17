import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle, FileText, CheckCircle2 } from '../components/Icons';
import Footer from '../components/Footer';

export default function Terms() {
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
              <span>Service Terms</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-[#64748B] text-xs font-mono mt-1.5">
              Last Updated: November 17, 2026
            </p>
            <p className="text-[#475569] text-[15px] mt-3 leading-relaxed">
              These Terms and Conditions govern your access to and use of UPI Scam Analyzer. By accessing or using the application, you agree to these terms. If you do not agree, do not use the service.
            </p>
          </div>

          {/* 1. Nature of Service & Non-Affiliation */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">1. Nature of Service and Non-Affiliation</h2>
            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-sm leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-xs uppercase tracking-wide text-[#92400E]">
                  Independent Heuristic Utility (No Government or Bank Affiliation)
                </strong>
                <p className="text-[#78350F]">
                  UPI Scam Analyzer is an independent educational and advisory utility. It is NOT a bank, payment service provider, law enforcement body, or regulatory authority, and it is NOT affiliated with, endorsed by, or certified by the National Payments Corporation of India (NPCI), the Reserve Bank of India (RBI), the Indian Cyber Crime Coordination Centre (I4C), or the Government of India.
                </p>
              </div>
            </div>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              The application evaluates user-submitted URLs, SMS/message text, UPI VPAs, phone numbers, and QR/screenshot payloads using local, deterministic rule checks to highlight common fraud patterns.
            </p>
          </section>

          {/* 2. Limitations of Rule-Based Detection */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">2. Limitations of Rule-Based Detection</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              Risk classifications (Safe, Warning, Dangerous) and numeric scores (0 to 25) are heuristic indicators only. You acknowledge and accept the following technical limitations:
            </p>
            <ul className="space-y-2 text-[15px] text-[#475569] list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-[#0F172A]">Not a Guarantee of Safety:</strong> A Safe classification (0 to 4) means no local rules were triggered. It does not guarantee that a URL, message, UPI ID, phone number, or payment request is legitimate or free from fraud.
              </li>
              <li>
                <strong className="text-[#0F172A]">Not Confirmed Fraud:</strong> A Warning or Dangerous classification indicates that specific rule patterns matched. It is not legal proof or official confirmation that an individual or organization is fraudulent.
              </li>
              <li>
                <strong className="text-[#0F172A]">No Live Bank or Network Verification:</strong> The local scanner does not verify live bank account ownership, live domain registration/WHOIS records, SSL certificate chains, or real-time telecom subscriber identity.
              </li>
              <li>
                <strong className="text-[#0F172A]">False Positives and False Negatives:</strong> Legitimate inputs may occasionally trigger rules (false positives), and novel, zero-day, or carefully disguised scams may evade static rules (false negatives).
              </li>
            </ul>
          </section>

          {/* 3. Permitted Use */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">3. Permitted Use and Prohibited Conduct</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              You may use UPI Scam Analyzer solely for lawful personal fraud awareness and preliminary inspection of suspicious identifiers. You agree NOT to:
            </p>
            <ul className="space-y-2 text-[15px] text-[#475569] list-disc pl-5 leading-relaxed">
              <li>Submit abusive automated traffic, denial-of-service requests, or unauthorized scraping against the application or its OTP verification endpoints.</li>
              <li>Attempt to bypass authentication, probe unauthorized endpoints, or interfere with other users&apos; accounts or sessions.</li>
              <li>Submit knowingly false, malicious, or defamatory entity reports targeting legitimate individuals or businesses.</li>
              <li>Upload malicious scripts or enter sensitive financial secrets (such as live UPI PINs, bank passwords, CVV codes, or real OTPs) into scanner fields.</li>
            </ul>
          </section>

          {/* 4. Account Responsibilities */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">4. Account and Transaction Responsibilities</h2>
            <ul className="space-y-2 text-[15px] text-[#475569] list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-[#0F172A]">Account Credentials:</strong> You are responsible for maintaining the confidentiality of your login email, password, and 6-digit email verification codes, and for all activity under your signed-in session.
              </li>
              <li>
                <strong className="text-[#0F172A]">Financial Decisions:</strong> You remain solely responsible for every payment or financial action you take. Always verify the beneficiary name inside your official UPI or banking app before approving any payment.
              </li>
              <li>
                <strong className="text-[#0F172A]">UPI PIN Safety:</strong> Never enter your UPI PIN to receive money or refunds; entering a UPI PIN authorizes an outgoing debit from your bank account.
              </li>
            </ul>
          </section>

          {/* 5. Official Cybercrime Reporting */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0F172A]">5. Fraud Reporting Disclaimer and Official Helpline (1930)</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              Using the Fraud Entity Reporting page records an entry in your local browser session for review demonstration. It does NOT submit a police First Information Report (FIR), notify your bank, or freeze fraudulent bank accounts.
            </p>
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-sm space-y-2 text-[#166534]">
              <div className="flex items-center gap-2 font-bold text-[#15803D] font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>National Cyber Crime Helpline (India): 1930</span>
              </div>
              <p className="leading-relaxed">
                If money has been debited fraudulently, call <strong className="text-[#14532D] font-mono">1930</strong> immediately and file a formal complaint on the National Cyber Crime Reporting Portal at{' '}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold underline font-mono"
                >
                  https://cybercrime.gov.in
                </a>{' '}
                (Ministry of Home Affairs / I4C), and alert your bank&apos;s fraud desk right away.
              </p>
            </div>
          </section>

          {/* 6. Warranty Disclaimer & Limitation of Liability */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-bold text-[#0F172A]">6. Disclaimer of Warranties and Limitation of Liability</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including implied warranties of accuracy, reliability, availability, or fitness for a particular purpose.
            </p>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              To the maximum extent permitted by applicable law, the developers and maintainers of UPI Scam Analyzer shall not be liable for any financial loss, unauthorized debit, indirect, incidental, special, or consequential damages resulting from your use of, or reliance on, any scan output or safety notice provided by the application.
            </p>
          </section>

          {/* 7. Changes & Governing Law */}
          <section className="space-y-2 border-t border-[#E2E8F0] pt-6">
            <h2 className="text-lg font-bold text-[#0F172A]">7. Modifications and Governing Law</h2>
            <p className="text-[#475569] text-[15px] leading-relaxed">
              We may revise these Terms and Conditions as the application evolves. Continued use of the application after an update constitutes acceptance of the revised terms. These terms are governed by the laws of India.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
