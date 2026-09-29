import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مِراسيم — بطاقات المعايدة ودعوات الأعراس والمناسبات الفاخرة",
  description: "منصة راقية لتصميم ومشاركة دعوات الأعراس الملكية وبطاقات المعايدة الفاخرة، مع تجربة فتح المغلف والختم الشمعي وتأكيد الحضور الذكي RSVP.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "مِراسيم — دعوات ملكية وبطاقات معايدة فاخرة",
    description: "شارك أحبتك أرقى لحظات الفرح بدعوات تفاعلية مذهبة وتأكيد حضور مباشر.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#080608] text-[#FAF4EB] antialiased selection:bg-[#D4AF37] selection:text-[#1A1208]">
        {children}
      </body>
    </html>
  );
}
