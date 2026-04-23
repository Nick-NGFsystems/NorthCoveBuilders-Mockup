"use client";

import { usePathname } from "next/navigation";

type PageChromeClientProps = {
  children: React.ReactNode;
};

export function PageChromeClient({ children }: PageChromeClientProps) {
  const pathname = usePathname();

  return children;
}
