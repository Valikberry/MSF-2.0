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
    <main className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />

        <div className="container mx-auto max-w-md  py-3">
          <div className="container mx-auto max-w-md">
            <div className="flex flex-col items-center">
              <h1 className="text-black-700 text-[17.5px] font-bold text-center">
                Finland’s Online Marketplace for Moving Services
              </h1>

              <h2 className="text-black-700 text-sm font-medium text-center">
                Book Movers in popular cities in Across Finland
              </h2>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-md px-4 py-4">
          <MainMenuCards />
          <CategoryFilterWrapper
            defaultActiveCategory={sheetId}
            basePath=""
            sheets={sheets}
          />
        </div>

        <div className="container mx-auto max-w-md px-4 py-2">
          <div className="flex items-center justify-center gap-2 flex-shrink-0 mb-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5TDE3IDEzLjc0TDE4LjE4IDIxTDEyIDE3Ljc3TDUuODIgMjFMNyAxMy43NEwyIDlMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2NTQ3IiBzdHJva2U9IiNGRjY1NDciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
              alt="Star"
              className="w-5 h-5 animate-pulse"
            />
            <h3 className="text-sm text-gray text-center">
              Click to get details on whatsappp
            </h3>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5TDE3IDEzLjc0TDE4LjE4IDIxTDEyIDE3Ljc3TDUuODIgMjFMNyAxMy43NEwyIDlMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2NTQ3IiBzdHJva2U9IiNGRjY1NDciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo="
              alt="Star"
              className="w-5 h-5 animate-bounce"
            />
          </div>
          {loading && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          )}
          {!loading && (
            <div className="pt-2">
              {(error || sheetData?.length === 0) && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
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
            </div>
          )}
          <CardsLayer data={sheetData} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
