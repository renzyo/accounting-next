import { Inter } from "next/font/google";

import "./globals.css";
import { ToasterProvider } from "@/providers/toaster-provider";
import { appDesc, appName } from "@/lib/static";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: appName,
  description: appDesc,
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToasterProvider />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
