import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
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
    country1,
    country2,
  ] = data;

  console.log("Cards data:status ", driverImageUrl);
  const isAvailable = true;
  const activeColor = statusColors[isAvailable ? "green" : "red"];
  const whatsAppOrTelegram = "WhatsApp";
  const [isBlocked, setIsBlocked] = useState(false);

  const handleClick = () => {
    // Handle click logic
  };

  const link = "#";
  const title = company;

  return (
    <div className="relative">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        passHref
        className="block"
        onClick={handleClick}
      >
        <div className="flex items-stretch gap-4 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow  relative min-h-[120px]">
          {/* Best Pick Badge */}
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-3 py-1  font-medium z-10">
            Best Pick
          </div>

          {/* WhatsApp Icon */}
          <div className="absolute top-7 right-4 z-10">
            <Image
              src="/whatsapp-color-svgrepo-com.svg"
              alt="WhatsApp"
              width={10}
              height={10}
              className="w-6 h-6"
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
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 p-2 mt-6">
            {/* Row 1: Company name */}
            <div>
              <h3 className="font-bold text-md text-gray-900">{company}</h3>
            </div>

            {/* Row 2: Status badges */}
            <div className="flex flex-wrap gap-2">
              {isAvailable ? (
                <div className="bg-[#CAF60B] text-green-700 text-xs px-1 py-1 rounded-sm font-medium">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 text-xs px-1 py-1 rounded-sm font-medium">
                  Not Active
                </div>
              )}

              {whatsAppOrTelegram === "WhatsApp" ? (
                <div className="bg-[#F0FDF4] text-[#15803D] text-xs px-3 py-1 rounded-full font-medium">
                  WhatsApp Community
                </div>
              ) : (
                <div className="bg-blue-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                  Telegram Community
                </div>
              )}
            </div>

            {/* Row 3: Service type and Price */}
            <div className="flex items-center justify-between">
              <div className="bg-[#E9F970] text-[#4A5258] text-sm px-1 py-1 rounded font-medium">
                {type}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm text-gray-600 font-bold"> € {price} Per Hour</div>
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
      </Link>
    </div>
  );
}