import "@/globals.css";
import { Inter } from "next/font/google";

import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Movie list app",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <ReduxProvider>
          <body className={inter.className}>
            <Header />
            {children}
          </body>
        </ReduxProvider>
      </html>
    </ReactQueryProvider>
  );
}
