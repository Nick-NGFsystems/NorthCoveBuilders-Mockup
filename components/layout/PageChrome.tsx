import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/sections/ContactSection";
import { getNgfContent } from "@/lib/ngf";
import { PageChromeClient } from "@/components/layout/PageChromeClient";

type PageChromeProps = {
  children: React.ReactNode;
};

export async function PageChrome({ children }: PageChromeProps) {
  const content = await getNgfContent()

  return (
    <>
      <Navbar content={content} />
      <PageChromeClient>
        <main id="main-content">{children}</main>
      </PageChromeClient>
      <ContactSection content={content} />
      <Footer />
    </>
  );
}
