import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  data: [string, string, string, string, string, string, string, string];
}

const statusColors: Record<string, string> = {
  green: "#16A34A",
  yellow: "#FFC107",
  red: "#DC3545",
};

export default function CustomCard({ data }: ProductCardProps) {
  const [
    imageUrl = "/placeholder.svg",
    id,
    company = "MS STAR MOVING COMPANY",
    type = "Van and Driver Only",
    driverImageUrl = "/placeholder.svg",
    price = "38",
    bestPick,
    active,
  ] = data;

  const isAvailable = active === "yes" ? true : false;
  const isBestPick = bestPick === "yes" ? true : false;
  const activeColor = statusColors[isAvailable ? "green" : "red"];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/initiate-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyId: id,
            imageUrl: imageUrl || "https://i.postimg.cc/mDw9dWqW/image.png",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "====");

      if (data.waLink) {
        // Safari-compatible redirect methods
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isSafari) {
          // Method 1: Try direct location assignment first
          try {
            window.location.href = data.waLink;
          } catch (e) {
            // Method 2: Fallback to creating a temporary link element
            const link = document.createElement('a');
            link.href = data.waLink;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          // For other browsers, use window.open
          window.open(data.waLink, "_blank", "noopener,noreferrer");
        }
      } else {
        throw new Error("No WhatsApp link received from server");
      }
    } catch (err: any) {
      console.error("Error initiating WhatsApp chat:", err);
      setError(err.message || "Failed to initiate WhatsApp chat");
    } finally {
      setIsLoading(false);
    }
  };

  const title = company;

  return (
    <div className="relative">
      <div rel="noopener noreferrer" className="block" onClick={handleClick}>
        <div className="flex items-stretch gap-4 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow  relative min-h-[100px]">
          {/* WhatsApp Icon */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <Image
              src="/whatsapp-color-svgrepo-com.svg"
              alt="WhatsApp"
              width={8}
              height={8}
              className="w-5 h-5"
            />
          </div>

          {/* Left side - Main image with driver avatar - Full height */}
          <div className="relative w-28 flex-shrink-0 self-stretch">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title || "no title"}
              fill
              className="object-cover rounded"
              sizes="112px"
            />

            {/* Driver avatar overlay */}
            <div className="absolute bottom-1 left-1  w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
              <Image
                src={driverImageUrl || "/placeholder.svg"}
                alt="Driver"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          </div>

          {/* Middle and Right Content Combined */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 p-2">
            {/* Row 1: Company name */}
            <div>
              <h3 className="font-bold text-sm text-gray-900">{company}</h3>
            </div>

            {/* Row 2: Status badges */}
            <div className="flex flex-wrap gap-2">
              {isAvailable ? (
                <div className="bg-[#F0FDF4] text-gray-700 text-xs px-1 py-1 rounded-sm font-medium">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 text-xs px-1 py-1 rounded-sm font-medium">
                  Not Active
                </div>
              )}

              <div className="bg-[#F0FDF4] text-[#15803D] text-xs px-3 py-1 rounded-sm font-medium">
                WhatsApp
              </div>
              {isBestPick && (
                <div className="bg-[#F0FDF4] text-red-800 text-xs px-3 py-1 rounded-sm font-medium">
                  Best pick
                </div>
              )}
            </div>

            {/* Row 3: Service type and Price */}
            <div className="flex items-center justify-between">
              {type ? (
                <div className="bg-[#E9F970] text-[#4A5258] text-xs px-1 py-1 rounded font-medium">
                  {type}
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-600 font-bold">
                    {" "}
                    € {price} Per Hour
                  </div>
                </div>

                {/* Status dot */}
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}