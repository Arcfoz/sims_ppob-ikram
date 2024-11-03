"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { topUpBalance, resetTopUpStatus } from "@/store/slices/transactionSlice";
import { AppDispatch, RootState } from "@/store";
import UserInfoCard from "@/components/UserInfoCard";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ResultDialog } from "@/components/ui/result-dialog";
import Image from "next/image";

const AMOUNT_OPTIONS = [10000, 20000, 50000, 100000, 250000, 500000];
const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 1000000;

export default function TopUpPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const { loading, topUpSuccess } = useSelector((state: RootState) => state.transaction);

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setAmount(numericValue);
  };

  const handleAmountOptionClick = (value: number) => {
    setAmount(value.toString());
  };

  const isValidAmount = () => {
    const numAmount = Number(amount);
    return numAmount >= MIN_AMOUNT && numAmount <= MAX_AMOUNT;
  };

  const handleTopUp = async () => {
    if (isValidAmount()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmTopUp = async () => {
    setShowConfirmDialog(false);
    await dispatch(topUpBalance(Number(amount)));
    setShowResultDialog(true);
  };

  const handleClose = () => {
    setShowResultDialog(false);
    dispatch(resetTopUpStatus());
    router.push("/dashboard");
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value) || 0 : value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  return (
    <div className="container py-8">
      <UserInfoCard />
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke beranda
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Silahkan masukan</h2>
            <h1 className="text-3xl font-bold mb-6">Nominal Top Up</h1>
            <div className="space-y-2">
              <Input type="text" value={formatCurrency(amount)} onChange={(e) => handleAmountChange(e.target.value)} placeholder="Enter amount" className="text-lg w-full" />
              {amount && !isValidAmount() && (
                <p className="text-sm text-destructive">
                  Amount must be between {formatCurrency(MIN_AMOUNT)} and {formatCurrency(MAX_AMOUNT)}
                </p>
              )}
            </div>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700" disabled={!isValidAmount() || loading} onClick={handleTopUp}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Top Up"
            )}
          </Button>
        </div>

        <div>
          <div className="h-[68px]" />
          <div className="grid grid-cols-3 gap-3">
            {AMOUNT_OPTIONS.map((value) => (
              <Button key={value} variant="outline" onClick={() => handleAmountOptionClick(value)} className={`h-16 ${amount === value.toString() ? "border-primary border-2" : ""}`}>
                {formatCurrency(value)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        icon={<Image src={"/Logo.png"} alt="logo" width={90} height={90} />}
        isOpen={showConfirmDialog}
        message={"Anda yakin untuk Top Up sebesar"}
        amount={amount}
        onConfirm={confirmTopUp}
        onCancel={() => setShowConfirmDialog(false)}
        onShowResult={() => setShowResultDialog(true)}
        confirmText="Ya, lanjutkan Top Up"
        cancelText="Batalkan"
      />

      <ResultDialog
        isOpen={showResultDialog}
        isSuccess={topUpSuccess}
        amount={amount}
        type="Top Up"
        onClose={() => {
          setShowResultDialog(false);
          handleClose();
        }}
      />
    </div>
  );
}
