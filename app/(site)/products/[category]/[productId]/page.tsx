// app/products/[category]/[productId]/page.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, ShoppingCart, CreditCard } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { SlidingImageCarousel } from "@/components/SlidingImages";
import { getStripe } from "@/lib/stripe";
import toast, { Toaster } from "react-hot-toast";
import React from "react";

interface NutritionDetail {
  key: string;
  value: string;
}

interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  subTitle: string;
  price: string;
  rating: number | null;
  contactMethod: string;
  productUrl: string;
  inStock: string;
  category: string;
  categoryName: string;
  discountPercentage: number;
  image2?: string;
  image3?: string;
  proDetails: NutritionDetail[];
  link:string
}

export default function ProductDetailsPage() {
  const { category, productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(
            String(category)
          )}/${encodeURIComponent(String(productId))}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (category && productId) {
      fetchProductDetails();
    }
  }, [category, productId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <Header />
          <div className="container mx-auto max-w-md px-4 py-8">
            <div className="flex justify-center items-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">
                Loading product details...
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <Header />
          <div className="container mx-auto max-w-md px-4 py-8">
            <div className="text-center py-8">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "The product you're looking for doesn't exist."}
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const discountedPrice =
    Number(product.price) * (1 - product.discountPercentage / 100);
  const totalPrice = (discountedPrice * quantity).toFixed(2);

  const handleCheckout = async () => {
    if (!product) return;

    setPaymentLoading(true);
    toast.loading("Redirecting to checkout...", { id: "checkout" });

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: discountedPrice,
          quantity: quantity,
          productImage: product.image,
          link:product.link
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await getStripe();
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage, { id: "checkout" });
    } finally {
      setPaymentLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto max-w-md py-1 px-3">
          <a
            href="/products"
            className="inline-flex items-center text-sm text-blue-600 hover:underline hover:text-blue-800 left-2"
          >
            ← products
          </a>

          <span className="mx-2 text-gray-400">/</span>

          <span className="text-sm font-medium text-gray-700">
            {product.name}
          </span>
        </div>
        <div className="container mx-auto max-w-md py-1">
          {/* Fixed Image Container - Now with consistent padding */}
          <div className="px-3 mb-4">
            <SlidingImageCarousel product={product} />
          </div>

          {/* Content Section */}
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
            <p className="text-gray-600 mb-3">{product.subTitle}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-2">
                {/* Discounted price in green */}
                <span className="text-2xl font-bold text-green-600">
                  $
                  {(
                    Number(product.price) *
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>

                {/* Original price in strikethrough */}
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {/* <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div> */}

            {/* Total Price */}
            {/* <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
              <span className="text-lg font-medium text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalPrice}
              </span>
            </div> */}

            <Tabs defaultValue="Description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nutrition">More info</TabsTrigger>
                <TabsTrigger value="Description">Description</TabsTrigger>
              </TabsList>

              <TabsContent value="nutrition" className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {product.proDetails && product.proDetails.length > 0 ? (
                    product.proDetails.map((detail, index) => (
                      <div className="bg-gray-50 p-3 rounded-lg" key={index}>
                        <div className="text-sm text-gray-500">
                          {detail.key}
                        </div>
                        <div className="text-lg font-semibold">
                          {detail.value}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No details available</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="Description" className="pt-4">
                <p className="text-gray-700 leading-relaxed">
                  <div>
                    {product.description.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </p>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pb-4 space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={paymentLoading}
                className="w-full bg-green-600 hover:bg-green-700 py-3"
              >
                {paymentLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Buy Now - ${totalPrice}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
