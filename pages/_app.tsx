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
    [Hardhat.chainId]: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  },
  multicallVersion: 2
}

function MyApp({ Component, pageProps }: AppProps) {
  console.log('config', config)
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  )
}

export default MyApp
