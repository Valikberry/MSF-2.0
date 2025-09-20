import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo.jpeg" alt={"Logo"} width={40} height={40} />
            <div className=" font-bold text-sm py-[1px]">MSF</div>
            </Link>
          </div>

         
        </div>
      </div>
    </header>
  );
}
