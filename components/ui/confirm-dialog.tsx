import React from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetPaymentStatus } from '@/store/slices/transactionSlice';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  amount?: string | number;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  onShowResult?: () => void;
}

export function ConfirmDialog({
  isOpen,
  message,
  amount,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
  onShowResult,
}: ConfirmDialogProps) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel();
    if (onShowResult) {
      dispatch(resetPaymentStatus());
      onShowResult();
    }
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
      <div className="bg-white rounded-lg w-[320px] p-6 flex flex-col items-center relative animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
        
        {icon && <div className="mb-4">{icon}</div>}
        
        <p className="text-center text-gray-600 text-sm mb-2">{message}</p>
        

          <div className="text-xl font-bold text-gray-900 mb-6">
          {formatCurrency(amount as number)}
          </div>

        
        <div className="space-y-3 w-full">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {confirmText}
          </button>
          
          <button
            onClick={handleCancel}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors duration-200"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}