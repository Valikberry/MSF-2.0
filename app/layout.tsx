import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";



// ROOT LAYOUT
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
       

      </head>
      <body suppressHydrationWarning={true}>
        <AppProvider>{children}</AppProvider>

       

     
      </body>
    </html>
  );
}
