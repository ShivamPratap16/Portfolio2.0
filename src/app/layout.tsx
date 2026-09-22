import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/nav/FloatingNav";
import MobileNav from "@/components/nav/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivam Pratap Raj — Software Engineer",
  description:
    "Backend engineer specializing in Kotlin, Spring Boot, and PostgreSQL. Building production APIs, optimizing performance, and designing scalable systems. Currently at LEAP Finance.",
  keywords: [
    "Shivam Pratap Raj",
    "software engineer",
    "backend developer",
    "Kotlin",
    "Spring Boot",
    "PostgreSQL",
    "REST API",
    "NIT Kurukshetra",
    "LEAP Finance",
  ],
  authors: [{ name: "Shivam Pratap Raj" }],
  openGraph: {
    type: "website",
    title: "Shivam Pratap Raj — Software Engineer",
    description:
      "Backend engineer building production APIs in Kotlin & Spring Boot. Currently at LEAP Finance.",
    url: "https://shivam-portfolio.vercel.app",
    siteName: "Shivam Pratap Raj",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Pratap Raj — Software Engineer",
    description:
      "Backend engineer building production APIs in Kotlin & Spring Boot.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shivam Pratap Raj",
              url: "https://shivam-portfolio.vercel.app",
              jobTitle: "Software Engineer",
              description:
                "Backend engineer specializing in Kotlin, Spring Boot, and PostgreSQL.",
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "National Institute of Technology, Kurukshetra",
              },
              worksFor: {
                "@type": "Organization",
                name: "LEAP Finance",
              },
              knowsAbout: [
                "Kotlin",
                "Java",
                "Spring Boot",
                "PostgreSQL",
                "Elasticsearch",
                "REST API Development",
                "System Design",
              ],
              sameAs: [
                "https://github.com/shivampratap",
                "https://linkedin.com/in/shivampratapraj",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-canvas text-ink font-mono min-h-screen antialiased`}
      >
        <FloatingNav />
        <MobileNav />
        <div className="mx-auto w-full max-w-5xl flex-1 min-h-screen flex flex-col border-x border-hairline">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
