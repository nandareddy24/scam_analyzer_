import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ScanningLoader from '../components/ScanningLoader';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeOcrQr } from '../services/analyzer';
import { Camera, QrCode, Search, Zap } from '../components/Icons';

export default function OcrQrScanner() {
  const [ocrFileName, setOcrFileName] = useState('');
  const [qrFileName, setQrFileName] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState('ocr');

  function handleOcrScan(e) {
    e.preventDefault();
    setScanType('ocr');
    setIsScanning(true);
    setResult(null);
  }

  function handleQrScan(e) {
    e.preventDefault();
    setScanType('qr');
    setIsScanning(true);
    setResult(null);
  }

  function handleScanComplete() {
    if (scanType === 'ocr') {
      const res = analyzeOcrQr(ocrFileName || 'payment_screenshot.png', 'Suspicious UPI VPA extracted: refund-care@ybl');
      setResult(res);
    } else {
      const payload = qrPayload || 'upi://pay?pa=scamuser@ybl&pn=FakeRefundCare&am=4999';
      const res = analyzeOcrQr(qrFileName || 'qr_image.png', payload);
      setResult(res);
    }
    setIsScanning(false);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">OCR Screenshot & QR Code Scanner</h1>
              <p className="text-xs text-slate-400">
                Upload payment receipts, WhatsApp chat screenshots, or QR images to extract and verify embedded threat payloads automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OCR Screenshot Scanner Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">OCR Screenshot Extractor</h3>
                  <p className="text-[11px] text-slate-400">Extracts VPAs and URLs from payment receipts</p>
                </div>
              </div>

              <form onSubmit={handleOcrScan} className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-slate-950/60 cursor-pointer transition-colors">
                  <input
                    type="file"
                    id="ocrFile"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setOcrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="ocrFile" className="cursor-pointer block">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs font-mono font-semibold text-slate-300 block truncate">
                      {ocrFileName ? `Selected: ${ocrFileName}` : 'Choose image file (.png, .jpg, .webp)'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isScanning && scanType === 'ocr' ? 'Processing OCR...' : 'Scan Screenshot Image'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* QR Fraud Detector Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">QR Payload Decoder</h3>
                  <p className="text-[11px] text-slate-400">Decodes embedded UPI payment payloads</p>
                </div>
              </div>

              <form onSubmit={handleQrScan} className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-slate-950/60 cursor-pointer transition-colors">
                  <input
                    type="file"
                    id="qrFile"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setQrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="qrFile" className="cursor-pointer block">
                    <QrCode className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs font-mono font-semibold text-slate-300 block truncate">
                      {qrFileName ? `Selected: ${qrFileName}` : 'Choose QR image file'}
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Or enter UPI payload: upi://pay?pa=handle@bank..."
                  value={qrPayload}
                  onChange={(e) => setQrPayload(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isScanning && scanType === 'qr' ? 'Decoding Payload...' : 'Decode & Verify QR Code'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Dynamic Scanning State */}
        {isScanning && (
          <ScanningLoader
            onComplete={handleScanComplete}
            targetType="QR"
            targetValue={scanType === 'ocr' ? ocrFileName || 'screenshot.png' : qrPayload || qrFileName || 'qr_intent.png'}
          />
        )}

        {/* Scan Result Output */}
        {result && !isScanning && (
          <ResultsDashboard
            result={result}
            onReset={() => {
              setResult(null);
              setOcrFileName('');
              setQrFileName('');
              setQrPayload('');
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
