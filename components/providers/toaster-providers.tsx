import { Toaster } from "@/components/ui/sonner";
import React from "react";

interface ToasterProvidersProps {
  children: React.ReactNode;
}

export default function ToasterProviders({ children }: ToasterProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
