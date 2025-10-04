import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ocrAPI } from '../../services/api';

interface ReceiptScannerProps {
  onDataExtracted?: (data: any) => void;
  onClose?: () => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onDataExtracted, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please drop an image file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setScanning(true);
      setError('');
      
      const response = await ocrAPI.scanReceipt(selectedFile);
      
      setResult(response.data);
      
      // Pass extracted data to parent component
      if (onDataExtracted) {
        onDataExtracted(response.data);
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.response?.data?.error || 'Failed to scan receipt');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUseData = () => {
    if (result && onDataExtracted) {
      onDataExtracted(result);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Receipt Scanner</h2>
              <p className="text-gray-600 text-sm mt-1">Upload a receipt to extract expense details automatically</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div>
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#61C0BF] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-[#61C0BF]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="w-full rounded-xl border-2 border-gray-200"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {selectedFile && !result && (
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full mt-4 bg-[#61C0BF] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Scanning Receipt...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2" size={20} />
                      Scan Receipt
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Results Section */}
            <div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start mb-4">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Receipt scanned successfully!</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 mb-3">Extracted Data:</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 uppercase">Amount</label>
                        <p className="font-semibold text-gray-800">
                          {result.amount ? `${result.currency || 'USD'} ${result.amount.toFixed(2)}` : 'Not detected'}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 uppercase">Currency</label>
                        <p className="font-semibold text-gray-800">{result.currency || 'Not detected'}</p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 uppercase">Date</label>
                        <p className="font-semibold text-gray-800">{result.date || 'Not detected'}</p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 uppercase">Category</label>
                        <p className="font-semibold text-gray-800">{result.category || 'Not detected'}</p>
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 uppercase">Merchant</label>
                        <p className="font-semibold text-gray-800">{result.merchant || 'Not detected'}</p>
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 uppercase">Confidence</label>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-[#61C0BF] h-2 rounded-full"
                              style={{ width: `${result.confidence || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {result.confidence ? `${Math.round(result.confidence)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.rawText && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="w-4 h-4 mr-2 text-gray-600" />
                        <label className="text-xs text-gray-500 uppercase font-semibold">Raw Text</label>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {result.rawText}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleUseData}
                      className="flex-1 bg-[#61C0BF] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition-all"
                    >
                      Use This Data
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Scan Another
                    </button>
                  </div>
                </div>
              )}

              {!result && !error && !scanning && (
                <div className="text-center text-gray-400 py-12">
                  <Camera className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <p>Upload a receipt to see extracted data here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
