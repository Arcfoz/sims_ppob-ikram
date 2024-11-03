"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Banknote } from "lucide-react";
import { payService } from "@/store/slices/transactionSlice";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import UserInfoCard from "../UserInfoCard";
import { Input } from "../ui/input";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { ResultDialog } from "../ui/result-dialog";

interface Service {
  service_code: string;
  service_name: string;
  service_tariff: number;
  service_icon: string;
}

interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
}

export default function ServiceDetails({ service, onBack }: ServiceDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { balance, loading: transactionLoading, paymentSuccess } = useSelector((state: RootState) => state.transaction);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handlePayment = () => {
    if (balance != null && balance >= service?.service_tariff) {
      setShowConfirmDialog(true);
    }
  };

  const confirmPayment = async () => {
    setShowConfirmDialog(false);
    await dispatch(payService(service.service_code));
    setShowResultDialog(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const insufficientBalance = (balance ?? 0) < service.service_tariff;

  return (
    <div className="container py-8">
      <UserInfoCard />

      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke beranda
      </Button>

      <div>
        <h1 className="text-2xl font-bold mb-8">Pembayaran</h1>

        <div className="flex items-center gap-2 mb-8">
          <Image src={service.service_icon} alt={service.service_name} height={40} width={40} quality={100} className="w-10 h-10 object-contain" />
          <span className="text-sm">{service.service_name}</span>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">Nominal Pembayaran</label>
            <Input startIcon={Banknote} value={formatCurrency(service.service_tariff)} disabled className="w-full" />
          </div>

          {insufficientBalance && <p className="text-red-600 text-sm">Saldo tidak mencukupi. Silahkan Top Up untuk melanjutkan.</p>}

          {insufficientBalance ? (
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push("/topup")}>
              Top Up Saldo
            </Button>
          ) : (
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handlePayment} disabled={transactionLoading}>
              {transactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Bayar"
              )}
            </Button>
          )}
        </div>
      </div>

      <>
        <ConfirmDialog
          icon={<Image src={"/Logo.png"} alt="logo" width={90} height={90} />}
          isOpen={showConfirmDialog}
          message={`Beli ${service.service_name} senilai`}
          amount={service.service_tariff}
          onConfirm={confirmPayment}
          onCancel={() => setShowConfirmDialog(false)}
          onShowResult={() => setShowResultDialog(true)}
          confirmText="Ya, lanjutkan bayar"
          cancelText="Batalkan"
        />

        <ResultDialog
          isOpen={showResultDialog}
          isSuccess={paymentSuccess}
          serviceName={service.service_name}
          amount={service.service_tariff}
          type="Pembayaran"
          onClose={() => {
            setShowResultDialog(false);
            onBack();
          }}
        />
      </>
    </div>
  );
}
