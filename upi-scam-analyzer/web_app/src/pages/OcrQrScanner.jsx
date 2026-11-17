import { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import {
  ModuleHeader,
  ModuleScopeCard,
  ValidationBanner,
  ScannerLoadingState,
  RelevantHistorySection,
} from '../components/ScannerPrimitives';
import { analyzeOcrQr } from '../services/analyzer';
import {
  getScanHistory,
  recordScanResult,
  clearScanHistory,
} from '../services/scanHistory';
import { Camera, QrCode, Search, RefreshCw, X } from '../components/Icons';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const QR_PRESETS = [
  {
    label: 'Suspicious Refund Collect QR',
    val: 'upi://pay?pa=refund-desk@ybl&pn=RefundDesk&am=5000&tn=urgent%20kyc%20refund',
  },
  {
    label: 'Standard Merchant Payment QR',
    val: 'upi://pay?pa=merchant@okaxis&pn=LocalStore&am=250',
  },
];

const OCR_PRESETS = [
  {
    label: 'Fake Refund Chat Receipt',
    val: 'Paytm KYC Refund Desk: Verify immediately and approve collect request to refund-care@ybl with OTP 839201.',
  },
  {
    label: 'Standard Payment Receipt',
    val: 'Paid INR 450 to Fresh Mart via UPI. Transaction ID 4329102938.',
  },
];

const CHECK_RULES = [
  'Validates uploaded image file format (PNG, JPG, WEBP) and 10 MB file size limit locally.',
  'Inspects decoded UPI payment intent URIs (upi://pay?pa=...) for scam lure keywords.',
  'Evaluates pasted screenshot text for refund scams, OTP traps, and embedded links.',
  'Limitation: Runs client-side text/URI rules only; does not perform automated server-side pixel OCR.',
];

export default function OcrQrScanner() {
  const [mode, setMode] = useState('qr'); // 'qr' | 'ocr'
  const [selectedFile, setSelectedFile] = useState(null);
  const [payloadText, setPayloadText] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    setHistory(getScanHistory('OCR'));
  }, []);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setError('');
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Select a valid image file (.png, .jpg, .jpeg, or .webp).');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError('Image exceeds the 10 MB size limit. Choose a smaller screenshot or QR image.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  }

  function clearFile() {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function runScan(overridePayload, overrideFileName) {
    const text = (overridePayload ?? payloadText).trim();
    const fileName = overrideFileName ?? selectedFile?.name ?? '';
    setError('');

    if (!fileName && !text) {
      setError(
        mode === 'qr'
          ? 'Upload a QR code image or enter a decoded UPI intent URI before running an inspection.'
          : 'Upload a payment screenshot or paste extracted text from the image before running an inspection.'
      );
      return;
    }

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const displayName = fileName || (mode === 'qr' ? 'qr_intent_payload' : 'screenshot_text');
      const rawAnalysis = analyzeOcrQr(displayName, text);
      const enrichedInput = text || displayName;
      const saved = recordScanResult(
        {
          ...rawAnalysis,
          input: enrichedInput,
          type: 'ocr',
        },
        'OCR'
      );
      setResult(saved);
      setHistory(getScanHistory('OCR'));
      setIsScanning(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }, 180);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runScan();
  }

  function handleReset() {
    clearFile();
    setPayloadText('');
    setError('');
    setResult(null);
  }

  function handleModeSwitch(nextMode) {
    setMode(nextMode);
    clearFile();
    setPayloadText('');
    setError('');
    setResult(null);
  }

  function handleClearHistory() {
    clearScanHistory('OCR');
    setHistory([]);
  }

  const activePresets = mode === 'qr' ? QR_PRESETS : OCR_PRESETS;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ModuleHeader
          icon={<QrCode className="w-5 h-5" />}
          title="QR & Screenshot OCR"
          badge="QR / OCR Module"
          description="Inspect uploaded payment screenshots, QR code images, and decoded UPI payment intent URIs before scanning or approving requests in your payment app."
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Scanner Form Card */}
          <section className="xl:col-span-8 card-enterprise p-5 sm:p-6">
            {/* Mode Tabs */}
            <div
              role="tablist"
              aria-label="Inspection mode"
              className="flex gap-1 border-b border-[#E2E8F0] pb-3.5 mb-5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'qr'}
                onClick={() => handleModeSwitch('qr')}
                className={`px-3 py-2 rounded-lg text-[13px] font-medium inline-flex items-center gap-2 transition-colors ${
                  mode === 'qr'
                    ? 'bg-[#14243A] text-white'
                    : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
                }`}
              >
                <QrCode className={`w-4 h-4 ${mode === 'qr' ? 'text-[#93C5FD]' : 'text-[#64748B]'}`} />
                <span>QR Code Payload</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'ocr'}
                onClick={() => handleModeSwitch('ocr')}
                className={`px-3 py-2 rounded-lg text-[13px] font-medium inline-flex items-center gap-2 transition-colors ${
                  mode === 'ocr'
                    ? 'bg-[#14243A] text-white'
                    : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FA]'
                }`}
              >
                <Camera className={`w-4 h-4 ${mode === 'ocr' ? 'text-[#93C5FD]' : 'text-[#64748B]'}`} />
                <span>Screenshot OCR</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <ValidationBanner message={error} onDismiss={() => setError('')} />

              {/* File Upload Zone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="scanner-image-upload"
                  className="block text-[13px] font-semibold text-[#172B4D]"
                >
                  {mode === 'qr' ? 'QR Code Image File' : 'Payment Receipt or Chat Screenshot'}
                </label>

                <div className="border border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-lg p-4 bg-[#F5F7FA] transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="scanner-image-upload"
                    accept="image/png,image/jpeg,image/webp,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-3 text-[13px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                          {mode === 'qr' ? <QrCode className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono font-medium text-[#172B4D] truncate">{selectedFile.name}</div>
                          <div className="text-xs text-[#64748B] font-mono">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:text-[#DC2626] bg-white border border-[#CBD5E1]"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="scanner-image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center py-2 text-center"
                    >
                      {mode === 'qr' ? (
                        <QrCode className="w-5 h-5 text-[#64748B] mb-1.5" />
                      ) : (
                        <Camera className="w-5 h-5 text-[#64748B] mb-1.5" />
                      )}
                      <span className="text-[13px] font-semibold text-[#172B4D]">
                        Click to select an image file
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5">
                        PNG, JPG, or WEBP up to 10 MB
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Decoded URI or Extracted Text */}
              <div className="space-y-1.5">
                <label
                  htmlFor="payload-text-input"
                  className="block text-[13px] font-semibold text-[#172B4D]"
                >
                  {mode === 'qr'
                    ? 'Decoded UPI Intent URI (Optional if image uploaded)'
                    : 'Extracted Screenshot Text (Optional if image uploaded)'}
                </label>

                {mode === 'qr' ? (
                  <input
                    id="payload-text-input"
                    type="text"
                    value={payloadText}
                    onChange={(e) => {
                      setPayloadText(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="upi://pay?pa=recipient@bank&pn=MerchantName&am=500"
                    aria-describedby="qr-ocr-helper"
                    className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 font-mono"
                  />
                ) : (
                  <textarea
                    id="payload-text-input"
                    rows={4}
                    value={payloadText}
                    onChange={(e) => {
                      setPayloadText(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Paste text copied from the receipt or chat screenshot for deeper keyword and link inspection..."
                    aria-describedby="qr-ocr-helper"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#172B4D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 resize-y"
                  />
                )}

                <p id="qr-ocr-helper" className="text-xs text-[#64748B]">
                  {mode === 'qr'
                    ? 'Provide a QR image file, a decoded upi://pay intent string, or both. Never enter your UPI PIN when scanning a QR code to receive money.'
                    : 'Include visible receipt or chat text so the local rule engine can evaluate UPI handles, links, and urgency lures.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#64748B]">Quick samples:</span>
                {activePresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPayloadText(p.val);
                      runScan(p.val, selectedFile?.name || `${mode}_sample.png`);
                    }}
                    className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#F5F7FA] hover:bg-[#EFF6FF] text-[#172B4D] hover:text-[#2563EB] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button type="submit" disabled={isScanning} className="btn-primary">
                  <Search className="w-4 h-4" />
                  <span>
                    {isScanning
                      ? 'Inspecting Payload...'
                      : mode === 'qr'
                      ? 'Inspect QR Payload'
                      : 'Inspect Screenshot'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isScanning && !selectedFile && !payloadText && !result}
                  className="btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 text-[#64748B]" />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </section>

          <div className="xl:col-span-4">
            <ModuleScopeCard
              title="QR & Payload Rules"
              subtitle="Checks executed locally on uploaded metadata & text"
              checks={CHECK_RULES}
            />
          </div>
        </div>

        {isScanning && (
          <ScannerLoadingState
            label="Evaluating QR intent and extracted screenshot payload..."
            target={payloadText || selectedFile?.name}
          />
        )}

        {!isScanning && result && (
          <div ref={resultsRef}>
            <ResultsDashboard result={result} onReset={handleReset} />
          </div>
        )}

        <RelevantHistorySection
          title="Recent QR & Screenshot Scans"
          emptyText="No QR code or screenshot scans recorded in this session yet."
          items={history}
          onSelect={(selectedResult) => {
            setPayloadText(selectedResult.input || '');
            setResult(selectedResult);
            setError('');
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 30);
          }}
          onClear={handleClearHistory}
        />
      </div>
    </AppLayout>
  );
}
