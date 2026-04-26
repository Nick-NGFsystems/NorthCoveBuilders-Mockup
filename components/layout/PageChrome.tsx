"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/sections/ContactSection";
import type { NgfSiteContent } from "@/lib/ngf";

type PageChromeProps = {
  children: React.ReactNode;
  content: NgfSiteContent;
};

export function PageChrome({ children, content }: PageChromeProps) {
  const pathname = usePathname();
  const showGlobalContact = pathname !== "/contact";

  return (
    <>
      <Navbar content={content} />
      <main id="main-content">{children}</main>
      {showGlobalContact ? <ContactSection content={content} /> : null}
      <Footer content={content} />
    </>
  );
}
