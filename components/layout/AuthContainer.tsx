"use client";
import { useState } from "react";
import { Login } from "@/components/layout/Login";
import { Register } from "@/components/layout/Register";
import Image from "next/image";

export const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 text-xl font-semibold">
              <Image src={"/Logo.png"} width={30} height={30} alt="logo" draggable={false} />
              <h1>SIMS PPOB</h1>
            </div>
          </div>

          <div>{isLogin ? <Login onSwitchToRegister={toggleAuth} /> : <Register onSwitchToLogin={toggleAuth} />}</div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-screen relative">
        <Image src="/Illustrasi Login.png" alt="Login Illustration" layout="fill" quality={100} className="object-cover" draggable={false} />
      </div>
    </div>
  );
};
