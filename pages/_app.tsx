import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Config, DAppProvider, Hardhat } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'

const config: Config = {
  readOnlyChainId: Hardhat.chainId,
  
  readOnlyUrls: {
    [Hardhat.chainId]: "http://localhost:8545",
  },
  multicallAddresses: {
    [Hardhat.chainId]: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821'
  },
  multicallVersion: 1
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  )
}

export default MyApp
