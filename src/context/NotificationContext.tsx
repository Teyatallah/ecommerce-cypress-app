"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  id: number;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }].slice(-2));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {notifications.map(({ id, message }) => (
          <div
            key={id}
            className="bg-black/75 text-white px-4 py-2 rounded shadow-lg max-w-sm"
            style={{
              animation: "slideIn 0.3s ease-out forwards",
            }}
          >
            {message}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
