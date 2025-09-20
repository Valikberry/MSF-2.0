import Header from "@/components/header";
import Footer from "@/components/footer";
import { PhoneCall } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-grow">
        {/* Hero */}
        <section className="px-4 py-4">
          <div className="container mx-auto max-w-md px-4">
            <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
              <h1 className="text-xl font-bold text-green-800">Contact Us</h1>
              <p className="text-black-700 text-sm">
                Want to get in touch? We would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-6">
          <div className="container mx-auto max-w-md px-4 space-y-6">
            <p className="text-black">
              we’re a job alert community built for action-takers.
            </p>

            <div className="text-black space-y-3">
              <p>
                📍 <strong>Location:</strong> We operate remotely
              </p>
              <p>
                🌐 <strong>Our Team:</strong> Small team of 3
              </p>
              <p>
                💬 <strong>WhatsApp Support:</strong> Have a question? 👉{" "}
                <a
                  href="https://wa.me/17062013006?text=Hi%20there!"
                  className="text-blue-500"
                  target="_blank"
                >
                  Message on WhatsApp
                </a>
              </p>
              <p className="flex">
                {" "}
                <PhoneCall size={20} />
                <strong className="px-2">Call Support:</strong>
                <a href="tel:+17062013006">
                  +1 (706) 201-3006
                </a>
              </p>
              <p>
                📧 <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@movingservicesfinland.com"
                  className="text-black-700 underline"
                >
                  contact@movingservicesfinland.com
                </a>
              </p>
              <div>
                <p>
                  ⏰ <strong>Support Hours:</strong>
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Mon–Fri: 8am – 6pm (GMT)</li>
                  <li>Sat–Sun: 10am – 4pm (GMT)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
