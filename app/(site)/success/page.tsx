"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      fetch("/api/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSession(data.session);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="text-center py-8">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {sessionId && (
          <div className="text-sm text-gray-500 mb-6">
            <p>Order ID:</p>
            <p className="break-all font-mono">{sessionId}</p>
          </div>
        )}
        <div className="space-y-3">
          {session?.metadata?.link && (
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href={session?.metadata?.link} target="_blank">
                Get the product
              </Link>
            </Button>
          )}
          <Button asChild className="w-full">
            <Link href="/products">
              <Package className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto max-w-md px-4 py-8">
          <Suspense
            fallback={<div className="text-center py-8">Loading...</div>}
          >
            <SuccessContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
