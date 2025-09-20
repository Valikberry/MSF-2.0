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
    bestPick,
    active,
  ] = data;

  console.log("Cards data:status ", driverImageUrl);
  const isAvailable = active === "yes" ? true : false;
  const isBestPick = bestPick === "yes" ? true : false;
  const activeColor = statusColors[isAvailable ? "green" : "red"];

  const handleClick = () => {
    console.log(id, "company id");
  };

  const title = company;

  return (
    <div className="relative">
      <div rel="noopener noreferrer" className="block" onClick={handleClick}>
        <div className="flex items-stretch gap-4 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow  relative min-h-[100px]">
          {/* WhatsApp Icon */}
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
                // <div className="bg-[#CAF60B] text-green-700 text-xs px-1 py-1 rounded-sm font-medium">
                //   Active
                // </div>
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
              <div className="bg-[#E9F970] text-[#4A5258] text-xs px-1 py-1 rounded font-medium">
                {type}
              </div>

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
    </div>
  );
}
