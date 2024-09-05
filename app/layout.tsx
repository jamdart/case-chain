"use client";
import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient, http } from 'viem';
import { getDefaultConfig, Chain, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, fallback, useReconnect, WagmiProvider } from "wagmi";
import { polygon, sepolia } from "wagmi/chains";

import { title } from "@/components/primitives";
import { useEffect } from "react";



//const { connectors } = getDefaultWallets({
//  appName: "My RainbowKit App",
//  projectId: "fbd0254e05f3184a5a70e0f44d0cad19",

//});

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: "fbd0254e05f3184a5a70e0f44d0cad19",
  chains: [polygon, sepolia],
  transports: {
    [polygon.id]: http(),
    [sepolia.id]: http()
  },
})

const wagmiConfig = createConfig({
  
  chains: [polygon, sepolia],
  transports: { 
    [polygon.id]: fallback([ 
      http('https://...'), 
      http('https://...'), 
    ]), 
    [sepolia.id]: http('https://...'), 
  }, 
});

function App() {
  const { reconnect } = useReconnect()

  useEffect(() => {
    reconnect()
  }, [])
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <div className="relative flex flex-col h-screen">
                <Navbar />

                <main className="container mx-auto max-w-7xl px-6 flex-grow">
                  {children}
                </main>
              </div>
            </Providers>
          </RainbowKitProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
