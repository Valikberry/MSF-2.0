"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CardsLayer from "@/components/CardsLayer";
import CategoryFilterWrapper from "@/components/CategoryFilterWrapper";
import MainMenuCards from "@/components/MenuCards";
import { useSheets } from "@/context/AppContext";
import { Calendar } from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const sheetId = typeof category === "string" ? category : "Helsinki";

  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sheets } = useSheets();
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sheets?city=${sheetId}`);

        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        setSheetData(data.sheetData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(
          `No Service found in ${category} city. Please check back later.`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sheetId]);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Fixed Title Section */}
      <div className="container mx-auto max-w-md py-3 flex-shrink-0">
        <div className="container mx-auto max-w-md">
          <div className="flex flex-col items-center">
            <h1 className="text-black-700 text-[17.5px] font-bold text-center">
              Finland's Online Marketplace for Moving Services
            </h1>

            <h2 className="text-black-700 text-sm font-medium text-center">
              Find and Book Movers in popular cities in Across Finland 
            </h2>
          </div>
        </div>
      </div>

      {/* Fixed Menu and Filter Section */}
      <div className="container mx-auto max-w-md px-4 py-2 flex-shrink-0">
        <MainMenuCards />
        <CategoryFilterWrapper
          defaultActiveCategory={sheetId}
          basePath=""
          sheets={sheets}
        />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-md px-4 py-2 h-full flex flex-col">
          <h3 className="text-sm text-gray text-center flex-shrink-0 mb-2">
            Click to get details on whatsappp
          </h3>
          
          {loading && (
            <div className="flex justify-center items-center mb-4 flex-shrink-0">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          )}
          
          {!loading && (error || sheetData?.length === 0) && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-700 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-1 text-red-600 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M9 12h6m2 2a9 9 0 11-6-8.48"
                />
              </svg>
              <p className="text-sm">
                {error || "No service found. Please check back later."}
              </p>
            </div>
          )}

          {/* Scrollable CardsLayer */}
          <div className="flex-1 overflow-y-auto pt-2">
            <CardsLayer data={sheetData} />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}