import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Admit - AI-Powered University Admissions",
  description:
    "Personalized college admission roadmaps for high school students worldwide, especially those from low-income backgrounds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">{children}</body>
    </html>
  );
}