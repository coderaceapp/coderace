// src/app/layout.tsx

"use client";

import './globals.css';
import React from "react";
import { ThemeProvider } from '../context/ThemeContext';  // Import your ThemeProvider

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the application with ThemeProvider */}

        <ThemeProvider>
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}