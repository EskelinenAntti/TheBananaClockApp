import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { ShareFooter } from "@/components/share-footer";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CreateMenu } from "@/components/create-menu";

export const metadata: Metadata = {
  title: "Banana Bar",
  description: "Create your own progress bar without going bananas.",
};
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ThemeProvider documentation recommends suppressing hydration 
          warnings for the html-tag, as ThemeProvider
          appends the style and class attributes to it. */}
      <body
        className={cn(
          "h-dvh w-full m-0 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <main className="flex flex-col h-dvh items-center p-4 gap-8">
              <div className="flex flex-row justify-between w-full">
                <CreateMenu />
                <ModeToggle />
              </div>

              {children}
            </main>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
