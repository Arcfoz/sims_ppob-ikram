"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AtSign, LockKeyhole, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store";
import { registerUser, resetAuth } from "@/store/slices/authSlice";

const isValidInternetDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
};

const formSchema = z
  .object({
    email: z
      .string()
      .email({ message: "email tidak valid" })
      .refine(
        (email) => {
          const domain = email.split("@")[1];
          return isValidInternetDomain(domain);
        },
        {
          message: "Domain email tidak valid",
        }
      ),
    first_name: z.string().min(1, { message: "Nama depan tidak boleh kosong" }),
    last_name: z.string().min(1, { message: "Nama belakang tidak boleh kosong" }),
    password: z.string().min(8, { message: "panjang password minimal 8 karakter" }),
    password_confirmation: z.string().min(8, { message: "panjang konfirmasi password minimal 8 karakter" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Password dan konfirmasi password tidak cocok",
  });

export const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (authState.success) {
      console.log("Registration successful");
      alert("Registrasi berhasil silahkan login");
      handleSwitchToLogin();
    }
    if (authState.error) {
      setErrorMessage(String(authState.error));
    }
  }, [authState.success, authState.error, dispatch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("");
    const registerData = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      password: values.password,
    };
    dispatch(registerUser(registerData));
  }

  const handleSwitchToLogin = () => {
    setErrorMessage("");
    dispatch(resetAuth());
    onSwitchToLogin();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-4 text-center">Lengkapi data untuk membuat akun</h2>
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input startIcon={AtSign} placeholder="masukan email anda" hasError={!!form.formState.errors.email} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input startIcon={User} placeholder="nama depan" hasError={!!form.formState.errors.first_name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input startIcon={User} placeholder="nama belakang" hasError={!!form.formState.errors.last_name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input startIcon={LockKeyhole} isPassword placeholder="Password" hasError={!!form.formState.errors.password} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input startIcon={LockKeyhole} isPassword placeholder="Konfirmasi Password" hasError={!!form.formState.errors.password_confirmation} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">
              {authState.loading ? "Loading..." : "Registrasi"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            sudah punya akun? login
            <button onClick={handleSwitchToLogin} className="ml-1 text-red-600 hover:text-red-800 font-medium">
              di sini
            </button>
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 rounded-lg p-4 w-full">
          <button onClick={() => setErrorMessage("")} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-red-600 font-semibold text-center">{errorMessage}</h1>
        </div>
      )}
    </div>
  );
};
