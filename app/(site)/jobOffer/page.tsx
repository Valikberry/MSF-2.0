"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import JobForm from "@/components/JobOffer";

export default function JobOfferPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto max-w-md py-4 px-2">
        <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200 hover:shadow-md transition-shadow px-3 py-2">
          <h1 className="text-xl font-bold text-green-800">Job offer</h1>

          <p className="text-black-700 text-sm">
            Do you have sponsored visa job openings? Reach qualified, niche
            candidates by submitting your offer through our form.
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-md px-4 space-y-6 mb-4">
        <JobForm />
      </div>

      <Footer />
    </main>
  );
}
