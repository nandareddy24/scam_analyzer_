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
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="border-b border-[#26364D] pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded bg-[#111C2E] border border-[#26364D] text-[#3B82F6] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#F1F5F9] tracking-tight">
                OCR Screenshot & QR Code Scanner
              </h1>
              <p className="text-xs text-[#A8B5C7]">
                Upload payment receipts, chat screenshots, or QR codes to extract and inspect embedded payment payloads.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OCR Screenshot Scanner Card */}
          <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-[#3B82F6]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#F1F5F9]">Receipt & Chat OCR</h3>
                  <p className="text-[11px] text-[#8291A6]">Extracts VPAs and URLs from payment screenshots</p>
                </div>
              </div>

              <form onSubmit={handleOcrScan} className="space-y-3">
                <div className="border border-dashed border-[#26364D] hover:border-[#3B82F6]/60 rounded-md p-4 text-center bg-[#080F1D]">
                  <input
                    type="file"
                    id="ocr-file-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setOcrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="ocr-file-upload" className="cursor-pointer block">
                    <Camera className="w-5 h-5 text-[#8291A6] mx-auto mb-1" />
                    <span className="text-xs font-medium text-[#A8B5C7] block truncate">
                      {ocrFileName ? ocrFileName : 'Select image file (.png, .jpg, .webp)'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect Screenshot</span>
                </button>
              </form>
            </div>
          </div>

          {/* QR Fraud Detector Card */}
          <div className="bg-[#111C2E] rounded-lg border border-[#26364D] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="w-4 h-4 text-[#3B82F6]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#F1F5F9]">QR Code Decoder</h3>
                  <p className="text-[11px] text-[#8291A6]">Decodes and inspects embedded UPI payment intents</p>
                </div>
              </div>

              <form onSubmit={handleQrScan} className="space-y-3">
                <div className="border border-dashed border-[#26364D] hover:border-[#3B82F6]/60 rounded-md p-4 text-center bg-[#080F1D]">
                  <input
                    type="file"
                    id="qr-file-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setQrFileName(e.target.files[0]?.name || '')}
                  />
                  <label htmlFor="qr-file-upload" className="cursor-pointer block">
                    <QrCode className="w-5 h-5 text-[#8291A6] mx-auto mb-1" />
                    <span className="text-xs font-medium text-[#A8B5C7] block truncate">
                      {qrFileName ? qrFileName : 'Select QR code image file'}
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Or enter URI e.g. upi://pay?pa=handle@bank&am=500"
                  value={qrPayload}
                  onChange={(e) => setQrPayload(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080F1D] border border-[#26364D] rounded-md text-xs text-[#F1F5F9] placeholder-[#8291A6] focus:outline-none focus:border-[#3B82F6] font-mono"
                />

                <button
                  type="submit"
                  className="btn-primary w-full"
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
