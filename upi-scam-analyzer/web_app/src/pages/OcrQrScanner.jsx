import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ResultsDashboard from '../components/ResultsDashboard';
import { analyzeOcrQr } from '../services/analyzer';
import { Camera, QrCode, Search } from '../components/Icons';

export default function OcrQrScanner() {
  const [ocrFileName, setOcrFileName] = useState('');
  const [qrFileName, setQrFileName] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [result, setResult] = useState(null);

  function handleOcrScan(e) {
    e.preventDefault();
    const fileName = ocrFileName || 'payment_receipt.png';
    const res = analyzeOcrQr(fileName, 'Extracted UPI identifier: refund-care@ybl');
    setResult(res);
  }

  function handleQrScan(e) {
    e.preventDefault();
    const payload = qrPayload.trim() || 'upi://pay?pa=refund-desk@ybl&pn=RefundDesk&am=5000';
    const fileName = qrFileName || 'qr_image.png';
    const res = analyzeOcrQr(fileName, payload);
    setResult(res);
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded bg-slate-800 text-blue-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                OCR Screenshot & QR Code Scanner
              </h1>
              <p className="text-xs text-slate-400">
                Upload payment receipts, chat screenshots, or QR codes to extract and inspect embedded payment payloads.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OCR Screenshot Scanner Card */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Camera className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Receipt & Chat OCR</h3>
                  <p className="text-[11px] text-slate-400">Extracts VPAs and URLs from payment screenshots</p>
                </div>
              </div>

              <form onSubmit={handleOcrScan} className="space-y-3">
                <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-5 text-center bg-slate-950">
                  <input
                    type="file"
                    id="ocrFile"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setOcrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="ocrFile" className="cursor-pointer block">
                    <Camera className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-slate-300 block truncate">
                      {ocrFileName ? ocrFileName : 'Select image file (.png, .jpg, .webp)'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect Screenshot</span>
                </button>
              </form>
            </div>
          </div>

          {/* QR Fraud Detector Card */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <QrCode className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">QR Code Decoder</h3>
                  <p className="text-[11px] text-slate-400">Decodes and inspects embedded UPI payment intents</p>
                </div>
              </div>

              <form onSubmit={handleQrScan} className="space-y-3">
                <div className="border border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-5 text-center bg-slate-950">
                  <input
                    type="file"
                    id="qrFile"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setQrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="qrFile" className="cursor-pointer block">
                    <QrCode className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-slate-300 block truncate">
                      {qrFileName ? qrFileName : 'Select QR code image file'}
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Or enter URI e.g. upi://pay?pa=handle@bank&am=500"
                  value={qrPayload}
                  onChange={(e) => setQrPayload(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect QR Code</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Scan Result Output */}
        {result && (
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
