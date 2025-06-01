import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyComics | Your Digital Collection",
  description: "Your personal comic book collection - Organize and enjoy your favorite comics in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col bg-background antialiased`}>
        <header className="bg-primary text-surface py-6 shadow-lg border-b border-accent/10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-extrabold text-surface hover:text-accent transition-colors duration-300 tracking-tight">
              MyComics
            </h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-primary text-light-accent py-6 border-t border-accent/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium tracking-wide">
              Made with{" "}
              <span className="text-accent hover:text-surface transition-colors duration-300">❤</span>
              {" "}by{" "}
              <span className="text-surface hover:text-accent transition-colors duration-300">
                BarrosDev
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
