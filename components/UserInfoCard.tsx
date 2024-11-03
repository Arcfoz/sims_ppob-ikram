"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { fetchProfile } from "@/store/slices/userSlice";
import { fetchBalance, toggleBalance } from "@/store/slices/transactionSlice";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";

export default function UserInfoCard() {
  const dispatch = useDispatch<AppDispatch>();

  const { showBalance } = useSelector((state: RootState) => state.transaction);
  const { profile, loading: profileLoading } = useSelector((state: RootState) => state.user);
  const { balance, loading: balanceLoading } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleToggleBalance = () => {
    dispatch(toggleBalance());
  };

  const formatCurrency = (amount: number) => {
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    const formattedCurrency = currencyFormatter.format(0);
    const currencySymbol = formattedCurrency.replace(/\d/g, '');
  
    return {
      symbol: currencySymbol,
      formattedAmount: currencyFormatter.format(amount),
    };
  };

  if (profileLoading || balanceLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="items-center gap-4 w-full md:w-1/3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.profile_image} className="object-cover" />
          <AvatarFallback>
            <Image src="/Profile Photo.png" width={100} height={100} alt="Default profile" />
          </AvatarFallback>
        </Avatar>
        <div className="mt-3">
          <p className="text-xl font-normal text-gray-600">Selamat datang,</p>
          <h2 className="text-3xl font-semibold">
            {profile?.first_name} {profile?.last_name}
          </h2>
        </div>
      </div>

      <div className="relative w-full md:w-2/3 flex justify-end">
        <div className="relative w-full md:w-[670px] h-[161px]">
          <Image src="/Background Saldo.png" width={670} height={161} alt="Card background" className="rounded-2xl w-full h-full object-cover md:object-contain" priority />
          <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-white opacity-90">Saldo anda</p>
              <p className="text-4xl font-bold text-white mt-1">{showBalance ? formatCurrency(balance || 0).formattedAmount : `${formatCurrency(0).symbol}••••••••`}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-red-600/50 flex items-center gap-2 text-sm md:text-base" onClick={handleToggleBalance}>
                {showBalance ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Sembunyikan Saldo</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Lihat Saldo</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
