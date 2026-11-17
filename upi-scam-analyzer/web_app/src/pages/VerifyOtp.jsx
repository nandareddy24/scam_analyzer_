import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../api/otpApi';
import { signUp } from '../services/authService';
import { Shield, AlertCircle, CheckCircle2, ArrowRight } from '../components/Icons';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, password } = location.state || {};

  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!email || !password) {
      navigate('/signup', { replace: true });
    }
  }, [email, password, navigate]);

  if (!email || !password) {
    return null;
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');

    if (otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setVerifying(true);
    const verifyResult = await verifyOtp(email, otp.trim());

    if (!verifyResult.success) {
      setVerifying(false);
      setError(verifyResult.message);
      return;
    }

    const signupResult = await signUp(email, password);
    setVerifying(false);

    if (!signupResult.success) {
      setError(signupResult.message);
      return;
    }

    navigate('/');
  }

  async function handleResend() {
    setResending(true);
    setError('');
    setInfo('');
    const result = await sendOtp(email);
    setResending(false);
    setInfo(result.success ? 'A new 6-digit verification code was sent to your email.' : '');
    if (!result.success) setError(result.message);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 sm:p-8 bg-[#F5F7FA] text-[#172B4D] font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md my-4">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 rounded-lg accent-blue-gradient text-white flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#14243A]">Scam Shield</span>
            </Link>
            <p className="text-[#64748B] text-sm">Verify your email address</p>
          </div>

          {/* Card */}
          <div className="card-enterprise p-6 sm:p-8">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Email Verification</h2>
              <p className="text-[#64748B] text-sm mt-1">
                We sent a 6-digit code to <strong className="text-[#0F172A]">{email}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-[#FEF2F2] border border-[#FECACA] p-3.5 rounded-lg flex items-start gap-2.5 text-sm text-[#B91C1C]">
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-[#B91C1C] font-semibold">Verification Failed</strong>
                  {error}
                </div>
              </div>
            )}

            {info && !error && (
              <div className="mb-5 bg-[#F0FDF4] border border-[#BBF7D0] p-3.5 rounded-lg flex items-start gap-2.5 text-sm text-[#15803D]">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {info}
                </div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label
                  htmlFor="otp-code"
                  className="block text-sm font-semibold text-[#0F172A] mb-2 text-center"
                >
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp-code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-[#2563EB] font-bold"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full btn-primary h-11 text-[15px]"
                >
                  <span>{verifying ? 'Validating Code...' : 'Confirm & Activate Account'}</span>
                  {!verifying && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-sm text-[#475569]">
              <span>Did not receive email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#2563EB] font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-3 text-xs text-[#64748B] space-x-3">
        <Link to="/privacy" className="hover:text-[#0F172A]">Privacy Policy</Link>
        <span>&bull;</span>
        <Link to="/terms" className="hover:text-[#0F172A]">Terms and Conditions</Link>
      </footer>
    </div>
  );
}
