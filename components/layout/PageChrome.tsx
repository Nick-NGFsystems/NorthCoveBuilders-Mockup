"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/sections/ContactSection";

type PageChromeProps = {
  children: React.ReactNode;
};

export function PageChrome({ children }: PageChromeProps) {
  const pathname = usePathname();
  const showGlobalContact = pathname !== "/contact";

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      {showGlobalContact ? <ContactSection /> : null}
      <Footer />
    </>
  );
}
