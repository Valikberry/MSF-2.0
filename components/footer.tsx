import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-4">
      <div className="container mx-auto max-w-xl py-4 text-center">
        {/* Nav Links */}
        <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <Link href="https://www.info.movingservicesfinland.com/About" target="_blank">About</Link>
          <span className="text-green-800">|</span>
          <Link href="https://www.info.movingservicesfinland.com/Contact" target="_blank">Contact</Link>
          <span className="text-green-800">|</span>
          <Link href="https://www.info.movingservicesfinland.com/Terms-of-service" target="_blank">T&C</Link>
          <span className="text-green-800">|</span>
          <Link href=" https://www.info.movingservicesfinland.com/faq" target="_blank">FAQ</Link>

       
        </div>

        {/* Contact Info */}
        <div className="text-xs text-gray-600 mb-3">
          <p>
            You may reach us at{" "}
            <a
              href="mailto:contact@movingservicesfinland.com"
              className="underline hover:text-green-800"
            >
              contact@movingservicesfinland.com
            </a>
          </p>
          <p>We work 24/7</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-4">
          <a
            href="https://www.youtube.com/@movingservicesfinland"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/footer/icons8-youtube.svg"
              alt="YouTube"
              width={26}
              height={26}
            />
          </a>
          <a
            href=" https://www.facebook.com/profile.php?id=61559287545856"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/footer/facebook-svgrepo-com.svg"
              alt="Facebook"
              width={20}
              height={20}
            />
          </a>
          <a
            href="https://www.reddit.com/user/Square_Ad6162/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/footer/reddit-svgrepo-com.svg"
              alt="Reddit"
              width={20}
              height={20}
            />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <Image
              src="/footer/tiktok-square-color-icon.svg"
              alt="TikTok"
              width={20}
              height={20}
            /> */}
            <Linkedin size={20} color="#0077B5"/>
          </a>
          <a
            href=" https://x.com/MSFinlandia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/footer/xlogo.png"
              alt="Instagram"
              width={26}
              height={26}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
