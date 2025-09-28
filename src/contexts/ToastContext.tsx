"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastType, ToastContainer } from "@/components/Toast";

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast("success", title, message);
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast("error", title, message);
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast("info", title, message);
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast("warning", title, message);
  }, [addToast]);

  const contextValue: ToastContextType = {
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}