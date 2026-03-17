import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

/* ── SEO + social metadata ───────────────────────────────── */
export const metadata: Metadata = {
    title: {
        default: "Swiss Referendum Info — smartinfo",
        template: "%s — smartinfo",
    },
    description:
        "Understand Swiss referendums with AI-powered, transparent, and sourced explanations. Built for informed participation in direct democracy.",
    keywords: [
        "Switzerland", "referendum", "Volksabstimmung",
        "direct democracy", "explainability", "AI", "smartinfo",
    ],
    authors: [{name: "smartinfo"}],
    openGraph: {
        title: "Swiss Referendum Info — smartinfo",
        description: "AI-powered explainers for Swiss direct democracy.",
        type: "website",
        locale: "en_CH",
        siteName: "smartinfo",
    },
    twitter: {
        card: "summary_large_image",
        title: "Swiss Referendum Info — smartinfo",
        description: "AI-powered explainers for Swiss direct democracy.",
    },
    robots: {index: true, follow: true},
};

/* ── Viewport + theme colour ─────────────────────────────── */
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#0f0f10"},
    ],
};

/* ── Root layout ─────────────────────────────────────────── */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            // suppressHydrationWarning
        >
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>

        <main className="mx-auto container ">
            <Header />
            {children}
            <Footer />
        </main>
        </body>

        </html>
    );
}