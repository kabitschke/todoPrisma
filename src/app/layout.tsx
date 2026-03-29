import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lista de tarefas 2026",
  description: "lista de tarefas, para ajudar a organização no dia a dia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
