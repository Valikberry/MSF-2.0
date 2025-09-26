"use client";
import Link from "next/link";

export default function MainMenuCards() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Link
        target="_blank"
        href={`https://docs.google.com/forms/d/e/1FAIpQLSdOIC2luIiznAbjdBJZxm8dQFVYpVmeB0X79WHjDWPvrnCerg/viewform`}
        className="block bg-gradient-to-b from-[#0a3747] to-[#344b5c] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="relative h-16 w-full flex flex-col items-center justify-center">
          <h3 className="text-white font-semibold text-center text-sm">
            Share your services
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
           <h3 className="text-white font-semibold text-center text-sm">
            Find Me A Mover
          </h3>
            <h4 className="text-white text-center text-xs sm:text-sm">
            (For Customers)
          </h4>
        </div>
      </Link>
    </div>
  );
}
