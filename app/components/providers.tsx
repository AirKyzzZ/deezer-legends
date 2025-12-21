"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/app/context/language-context";
import { LanguageSwitcher } from "@/app/components/language-switcher";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers Component
 * Wraps the app with all necessary context providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      {/* Language Switcher - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      {children}
    </LanguageProvider>
  );
}

