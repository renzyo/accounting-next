"use client";

import "../../globals.css";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoginUserSchema } from "@/lib/validations/user.schema";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";

type loginSchema = z.infer<typeof LoginUserSchema>;

export default function Login() {
  const t = useTranslations("Login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<loginSchema>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: loginSchema) => {
    try {
      setLoading(true);
      const data = {
        email: values.email.toLowerCase(),
        password: values.password,
      };

      const response = await axios.post("/api/auth/login", data);

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(t("emailPasswordError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="background"
      className="h-screen w-screen bg-slate-600 flex justify-center items-center"
    >
      <div
        id="box"
        className="w-full px-8 md:w-1/2 md:h-3/4 flex flex-col md:flex-row"
      >
        <div id="image" className="md:w-1/2 md:h-full">
          <Image
            src="https://images.unsplash.com/photo-1579621970343-21c491b3f363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            className="w-full h-64 md:w-full md:h-full object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl"
            width={400}
            height={500}
            alt="Cat"
          />
        </div>
        <div
          id="login-form"
          className="w-full md:w-1/2 h-full bg-white rounded-b-xl md:rounded-bl-none md:rounded-r-xl flex flex-col items-center justify-center p-8 relative"
        >
          <div className="absolute top-4 right-4">
            <LocaleSwitcher />
          </div>
          <h2 className="text-3xl font-bold text-center">{t("appName")}</h2>
          <h2 className="text-sm text-center mt-4 text-gray-400 font-bold mb-8">
            {t("appDescription")}
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Email"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {t("login")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
