import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner"; // ✅ Add this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GaadiDekho",
  description: "Find Your Dream Car",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen">
            <Header />
            {children}
          </main>

          <Toaster richColors /> 

          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>MADE BY LOVE ❤️</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
