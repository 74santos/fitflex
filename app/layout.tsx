import type { Metadata } from "next";
import { Ubuntu, Inter} from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider"; 
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:{
    template: `%s | FitFlex`,
    default: APP_NAME,
  },
  description:  APP_DESCRIPTION ,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ubuntu.variable} antialiased`}
      >
       <ThemeProvider 
       attribute="class"
       defaultTheme="light"
       enableSystem
       disableTransitionOnChange
       >
         <AuthSessionProvider >
        {children}
        <Toaster />
        </AuthSessionProvider>
       </ThemeProvider>

      </body>
    </html>
  );
}
