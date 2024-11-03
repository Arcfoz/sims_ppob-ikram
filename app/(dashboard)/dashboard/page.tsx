"use client";

import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { fetchBanners, fetchServices } from "@/store/slices/informationSlice";
import { fetchBalance } from "@/store/slices/transactionSlice";
import UserInfoCard from "@/components/UserInfoCard";
import ServiceDetails from "@/components/layout/ServiceDetail";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";

interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface Banner {
  banner_image: string;
  banner_name: string;
  description: string;
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, services, loading: servicesLoading } = useSelector((state: RootState) => state.information);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const initializeData = useCallback(() => {
    const promises = [dispatch(fetchBanners()), dispatch(fetchServices()), dispatch(fetchBalance())];
    return Promise.all(promises);
  }, [dispatch]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (selectedService) {
    return <ServiceDetails service={selectedService} onBack={() => setSelectedService(null)} />;
  }

  return (
    <div className="container py-8 space-y-8">
      <UserInfoCard />

      <section className="w-full">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 px-4">
          {services.map((service: Service) => (
            <div key={service.service_code} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleServiceClick(service)}>
              <Image src={service.service_icon} alt={service.service_name} width={60} height={60} className="w-[60px] h-[60px] object-contain mb-2" />
              <span className="text-xs text-center">{service.service_name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h1 className="font-semibold mb-5">Temukan Promo Menarik</h1>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {banners.map((banner: Banner, index: number) => (
              <div key={`banner-${index}`} className="flex-none w-[270px]">
                <div className="rounded-lg overflow-hidden">
                  <Image src={banner.banner_image} alt={banner.banner_name} width={270} height={171} quality={100} className="w-full object-contain" />
                  <div className="p-4">
                    <h3 className="font-semibold">{banner.banner_name}</h3>
                    <p className="text-sm text-gray-600">{banner.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
