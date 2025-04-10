"use client";
import { WagmiAdapter,projectID, wagmiAdapter } from "@/app/otherPages/walletConnect/index";
import { createAppKit } from "@reown/appkit";

import { mainnet, arbitrum } from "@reown/appkit/networks";

import {QueryClient, QueryClientProvder} from "@tanstack/react-query"
import React, {ReactNode} from "react"
import {cookieToInitialState,WagmiProvider, config} from "wagmi"

const QueryClient = new QueryClient();

if(!projectID){
    throw new Error("project ID is not defined")
}

const metadata = {
    name:"appkit-example",
    description: "AppKit Example - EVM",
    url:"https://exampleapp.com",
    icons: ["/images/BundlesBetsLogo.png"]
}
const modal = createAppKit({
    adapters:[wagmiAdapter],
    projectID,
    networks:[mainnet,arbitrum],
    defaultNetwork:mainnet,
    features:{
        analytics:true,
        email:true,
        socials:[
            "google","x","github","discord","farcaster"
        ],
        emailShowWallets:true
    },
    themeMode:"light"
})

function ContextProvider({children,cookies}){
    const initialSate = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);
    return(
        <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialSate}>
            <QueryClientProvder client={QueryClient}>{children}</QueryClientProvder>
        </WagmiProvider>   
    )
}

export default ContextProvider;