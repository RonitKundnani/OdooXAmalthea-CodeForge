import React, { useState } from 'react';
import { Upload, Camera, Receipt, Calendar, Tag, DollarSign, FileText, ScanLine, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReceiptScanner } from '../../components/expenses/ReceiptScanner';
import { expensesAPI, ocrAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const currencyList = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'CAD', 'AUD'];
const categories = [
  { key: 'Travel', label: 'Travel', icon: <Tag size={16} /> },
  { key: 'Meals', label: 'Meals', icon: <Tag size={16} /> },
  { key: 'Accommodation', label: 'Accommodation', icon: <Tag size={16} /> },
  { key: 'Office Supplies', label: 'Office Supplies', icon: <Tag size={16} /> },
  { key: 'Entertainment', label: 'Entertainment', icon: <Tag size={16} /> },
  { key: 'Transportation', label: 'Transportation', icon: <Tag size={16} /> },
  { key: 'Technology', label: 'Technology', icon: <Tag size={16} /> },
  { key: 'Training', label: 'Training', icon: <Tag size={16} /> },
  { key: 'Other', label: 'Other', icon: <Tag size={16} /> },
];

export default function SubmitExpense() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('Travel');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleDataExtracted = (data: any) => {
    console.log('=== Data Extracted from OCR ===');
    console.log('Received data:', data);
    console.log('Amount:', data.amount);
    console.log('Currency:', data.currency);
    console.log('Category:', data.category);
    console.log('Date:', data.date);
    console.log('Merchant:', data.merchant);
    
    // Auto-fill form with extracted data
    if (data.amount) {
      console.log('Setting amount to:', data.amount.toString());
      setAmount(data.amount.toString());
    } else {
      console.log('⚠️ No amount in data');
    }
    if (data.currency) setCurrency(data.currency);
    if (data.category) setCategory(data.category);
    if (data.date) {
      // Try to parse and format date
      try {
        const parsedDate = new Date(data.date);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate.toISOString().split('T')[0]);
        }
      } catch (e) {
        console.log('Date parsing failed:', e);
      }
    }
    if (data.merchant) setDescription(data.merchant);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setFileName(file.name);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Create expense
      const expenseData = {
        amount: parseFloat(amount),
        currencyCode: currency,
        category: category,
        description: description || '',
        expenseDate: date,
      };

      console.log('Submitting expense:', expenseData);
      const response = await expensesAPI.createExpense(expenseData);
      console.log('Expense created:', response);

      const expenseId = response.expenseId;

      // Upload receipt if file is selected
      if (receiptFile && expenseId) {
        console.log('Uploading receipt for expense:', expenseId);
        await ocrAPI.uploadReceipt(receiptFile, expenseId);
        console.log('Receipt uploaded successfully');
      }

      setSuccessMessage('Expense submitted successfully!');
      
      // Reset form
      setTimeout(() => {
        navigate('/expenses/history');
      }, 1500);

    } catch (error: any) {
      console.error('Submit error:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Failed to submit expense. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implement draft saving
    alert('Draft saving feature coming soon!');
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl shadow-sm border border-[#F3D7CF] bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Submit Expense</h2>
          <p className="text-sm text-gray-500 mb-6">Fill the details below and attach your receipt.</p>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.amount ? 'border-red-300' : 'border-gray-300'} focus:border-[#BBDED6] focus:ring-0`}
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                >
                  {currencyList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hint: Auto-detected based on your country. Conversion shown on review.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0 appearance-none bg-white pl-3 pr-8 py-2"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <Tag className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.date ? 'border-red-300' : 'border-gray-300'} focus:border-[#BBDED6] focus:ring-0`}
                />
              </div>
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Receipt)</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-[#FAE3D9] cursor-pointer text-sm">
                  <Upload size={16} className="mr-2" /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <button 
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-[#61C0BF] text-white text-sm shadow hover:brightness-110" 
                  type="button"
                  onClick={() => setShowScanner(true)}
                >
                  <ScanLine size={16} className="mr-2" /> OCR Scan
                </button>
                {fileName && <span className="text-xs text-gray-600 truncate">{fileName}</span>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this expense for?"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-[#BBDED6] focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button 
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#FFB6B9] text-white shadow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Submitting...
                </>
              ) : (
                'Submit Expense'
              )}
            </button>
          </div>
          </form>
        </div>
      </div>

      {/* Receipt Scanner Modal */}
      {showScanner && (
        <ReceiptScanner
          onDataExtracted={handleDataExtracted}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
