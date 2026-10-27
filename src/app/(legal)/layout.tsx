import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main
        id="main"
        tabIndex={-1}
        className="min-h-[calc(100svh-4rem)] lg:min-h-svh"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
