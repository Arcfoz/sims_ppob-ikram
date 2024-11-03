import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetPaymentStatus } from '@/store/slices/transactionSlice';

interface ResultDialogProps {
  isOpen: boolean;
  type: string;
  isSuccess: boolean;
  serviceName?: string;
  amount?: string | number;
  onClose: () => void;
  closeText?: string;
}

export function ResultDialog({
  isOpen,
  type,
  isSuccess,
  serviceName,
  amount,
  onClose,
  closeText = 'Kembali ke Beranda',
}: ResultDialogProps) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(resetPaymentStatus());
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-[320px] p-6 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
        <div className="w-20 h-20 mb-4">
          {isSuccess ? (
            <CheckCircle2 className="w-full h-full text-green-500" />
          ) : (
            <XCircle className="w-full h-full text-red-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {`${type} ${serviceName ? serviceName + ' ' : ''}sebesar`}
        </h3>
        
        <div className="text-xl font-bold text-gray-900 mb-2">
          {formatCurrency(amount as number)}
        </div>
        
        <p className="text-center text-gray-600 text-sm mb-6">
          {isSuccess ? "Berhasil" :  "Gagal"}
        </p>
        
        <button
          onClick={handleClose}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          {closeText}
        </button>
      </div>
    </div>
  );
}