"use client";
import Link from "next/link";

export default function MainMenuCards() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Link
        href={`#`}
        className="block bg-gradient-to-b from-[#0a3747] to-[#344b5c] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="relative h-16 w-full flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold text-center text-xs sm:text-sm md:text-base">
            Work with us
          </h3>
          <h4 className="text-white text-center text-xs sm:text-sm">
            ( For drivers)
          </h4>
        </div>
      </Link>
      <Link
        href={`#`}
        className="block bg-[#F7931A] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="relative h-16 w-full flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold text-center text-xs sm:text-sm md:text-base">
            {/* Apply smarter & faster */}
          </h3>
          <h4 className="text-white text-center text-xs sm:text-sm">
            {/* (For Job Seekers) */}
          </h4>
        </div>
      </Link>
    </div>
  );
}