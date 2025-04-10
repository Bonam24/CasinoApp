import {cookieStorage, createStorage} from "wagmi"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import {mainnet, abitrum, arbitrum} from "@reown/appkit/networks"

export const projectID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if(!projectID){
    throw new Error("Project Id is not defined")
}

export const networks = [mainnet,arbitrum]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage:cookieStorage
    }),
    ssr:true,
    networks,
    projectID
})

export const config = wagmiAdapter.wagmiConfig