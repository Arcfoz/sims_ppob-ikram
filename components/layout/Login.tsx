"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AtSign, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { loginUser, resetAuth } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "email tidak valid" }),
  password: z.string().min(8, { message: "panjang password minimal 8 karakter" }),
});

export const Login = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (authState.success && authState.token) {
      router.push("/dashboard");
      dispatch(resetAuth());
    }

    if (authState.error) {
      setErrorMessage(String(authState.error));
    }
  }, [authState.success, authState.error, authState.token, dispatch, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("");
    dispatch(loginUser(values));
  }

  const handleSwitchToRegister = () => {
    setErrorMessage("");
    dispatch(resetAuth());
    onSwitchToRegister();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-4 text-center">Masuk atau buat akun untuk memulai</h2>
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
          <Button type="submit" className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700" disabled={authState.loading}>
            {authState.loading ? "Loading..." : "Masuk"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          belum punya akun? registrasi
          <button onClick={handleSwitchToRegister} className="ml-1 text-red-600 hover:text-red-800 font-medium">
            di sini
          </button>
        </p>
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

export default Login;
