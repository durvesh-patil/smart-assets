"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { toast, Toaster } from "sonner";

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    switch (severity) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Toaster position="bottom-center" />
    </SnackbarContext.Provider>
  );
}

// Custom hook to use the Snackbar
export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
