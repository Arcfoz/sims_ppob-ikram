"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import { fetchTransactionHistory, resetTransactions } from "@/store/slices/transactionSlice";
import { AppDispatch, RootState } from "@/store";
import UserInfoCard from "@/components/UserInfoCard";

interface Transaction {
  invoice_number: string;
  created_on: string;
  transaction_type: "TOPUP" | string;
  total_amount: number;
  description: string;
}

const INITIAL_LIMIT = 5;

export default function TransactionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [offset, setOffset] = useState(0); // New state for tracking offset
  const { transactions, loading, hasMore } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    const initializeData = async () => {
      await dispatch(resetTransactions());
      setOffset(0);
      await dispatch(fetchTransactionHistory({ offset: 0, limit: INITIAL_LIMIT }));
    };

    initializeData();

    return () => {
      dispatch(resetTransactions());
    };
  }, []);

  const loadMore = () => {
    const newOffset = offset + INITIAL_LIMIT;
    setOffset(newOffset);
    dispatch(fetchTransactionHistory({ offset: newOffset, limit: INITIAL_LIMIT }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container py-8">
      <UserInfoCard />
      <h1 className="text-2xl font-semibold my-6">Semua Transaksi</h1>

      <div className="space-y-4">
        {transactions.map((transaction: Transaction) => (
          <div key={`${transaction.invoice_number}-${transaction.created_on}`} className="bg-white shadow-md rounded-md border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className={`text-lg font-semibold ${transaction.transaction_type === "TOPUP" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.transaction_type === "TOPUP" && <Plus className="inline-block mr-1 h-4 w-4" />}
                  {transaction.transaction_type !== "TOPUP" && <Minus className="inline-block mr-1 h-4 w-4" />}
                  {formatCurrency(transaction.total_amount)}
                </p>
                <p className="text-xs text-gray-500">{formatDate(transaction.created_on)}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm`}>{transaction.description}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {hasMore && !loading && (
          <Button variant="outline" className="w-full" onClick={loadMore}>
            Show More
          </Button>
        )}

        {!hasMore && transactions.length > 0 && <p className="text-center text-gray-500 py-4">No more transactions to load</p>}

        {!loading && transactions.length === 0 && (
          <div className="bg-white shadow-md rounded-md border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
