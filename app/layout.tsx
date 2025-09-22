import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

// SEO Metadata
export const metadata: Metadata = {
  title: "Moving Services Finland | Marketplace for Movers",
  description: "Moving Services Finland is a marketplace to compare movers and book vans, drivers & helpers across Helsinki, Espoo, Vantaa, Tampere and more — 24/7 online.",
  keywords: "moving services marketplace, book movers Finland, hire van and driver, movers Helsinki, movers Espoo, movers Vantaa, moving help Finland",
  applicationName: "Moving Services Finland",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.movingservicesfinland.com/"
  },
  openGraph: {
    type: "website",
    url: "https://www.movingservicesfinland.com/",
    title: "Moving Services Finland | Marketplace for Movers",
    description: "Compare movers, see transparent hourly rates, and book vans, drivers & helpers across Finland — 24/7.",
    images: [
      {
        url: "https://www.movingservicesfinland.com/images/og-image.jpg",
        alt: "Moving Services Finland Marketplace"
      }
    ],
    siteName: "Moving Services Finland"
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Services Finland | Marketplace for Movers",
    description: "A marketplace to compare and book moving services anywhere in Finland.",
    images: ["https://www.movingservicesfinland.com/images/twitter-card.jpg"]
  }
};

// ROOT LAYOUT
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EK39Z785QR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EK39Z785QR');
          `}
        </Script>

        {/* JSON-LD Schema Markup */}
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Moving Services Finland",
              "alternateName": "MSF",
              "url": "https://www.movingservicesfinland.com/",
              "description": "Moving Services Finland is an online marketplace where customers compare movers and book vans, drivers and helpers 24/7 across Finland.",
              "publisher": {
                "@type": "Organization",
                "name": "Moving Services Finland",
                "url": "https://www.movingservicesfinland.com/",
                "logo": "https://www.movingservicesfinland.com/logo.png"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.movingservicesfinland.com/search?location={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "OfferCatalog",
                "name": "Marketplace of Moving Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "35",
                      "unitText": "HOUR"
                    },
                    "itemOffered": {
                      "@type": "Service",
                      "serviceType": "Van and driver only",
                      "areaServed": "Finland",
                      "provider": {
                        "@type": "Organization",
                        "name": "Independent movers on Moving Services Finland"
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": "60",
                      "unitText": "HOUR"
                    },
                    "itemOffered": {
                      "@type": "Service",
                      "serviceType": "Van + driver & 2 helpers",
                      "areaServed": "Finland",
                      "provider": {
                        "@type": "Organization",
                        "name": "Independent movers on Moving Services Finland"
                      }
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}