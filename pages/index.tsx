import type { NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { useStorage } from '../gen/hooks/Storage'

const Home: NextPage = () => {
  const { account, library, activateBrowserWallet } = useEthers()

  const {value: retrievedValue} = useStorage.retrieve('0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3', []) || {}
  
  
  const { send: store, state: storeState } = useStorage.store('0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3')

  return (
    <div>
      <div>
        <button onClick={() => activateBrowserWallet()}>Connect</button>
      </div>
      {account && (
        <div>
          <>
            Account: {account} <br/>

            Storage value: {retrievedValue?.toString()}

            <button onClick={() => store(100)}>setStore</button>

            {JSON.stringify(storeState)}

          </>
        </div>
      )}
    </div>
  )
}

export default Home
