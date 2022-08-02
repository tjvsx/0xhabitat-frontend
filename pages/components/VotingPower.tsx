import type { NextComponentType, NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { useStorage } from '../../gen/hooks/Storage'
import { MouseEvent, SetStateAction, useState } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'

const VotingPower: NextComponentType = () => {
  const { account, library, activateBrowserWallet } = useEthers()

  const {value: retrievedValue} = useStorage.retrieve('0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3', []) || {}
  
  const { send: store, state: storeState } = useStorage.store('0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3')

  const GOV_TOKEN_NAME = 'Habitat Token'
  const GOV_TOKEN_SYMBOL = 'HBT'
  const GOV_TOKEN_DECIMALS = 18

  const HBT_BALANCE = 2000;
  const HBT_STAKED = 3000;
  const HBT_ETH_PAIR_STAKED = 0.8;
  const POWER = 80000;

  const PAIR_BALANCE = 0.8;
  const PAIR_STAKED = 1.4;

  const [showModal, setShowModal] = useState(true);
  const [isPairSelected, setPairSelected] = useState(true)
  const [pair, setPair] = useState("HBT/ETH");
  const [amountToStake, setAmountToStake] = useState(0);

  async function managePairs() {
    setPairSelected(true);
    setAmountToStake(0);
    const balance = 1.4;
    const staked = 1.3
    // call balanceOf view function & staked view function

    return {balance, staked}
  }

  async function manageToken() {
    setPairSelected(false);
    setAmountToStake(0);
  }

  return (
    <main>


      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative my-6 mx-auto max-w-3xl w-96">
            <button onClick={() => {setShowModal(false)}} className='absolute right-[-1em] top-[-1em] z-50'>X</button>
              {/*content*/}
              <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-evenly divide-x-2 divide-slate-200 p-3 border-b-2 border-slate-200">
                  <div 
                    className='w-1/2 text-center cursor-pointer truncate px-4'
                    style={{textDecoration: isPairSelected ? '' : 'underline'}}
                    onClick={() => manageToken()}>{GOV_TOKEN_NAME}
                  </div>
                  <div 
                    className='w-1/2 text-center cursor-pointer'                     
                    style={{textDecoration: isPairSelected ? 'underline' : ''}}
                    onClick={() => managePairs()}>Pairs</div>
                </div>

                {/*body*/}
                <div className="relative p-5 flex-auto h-32 justify-between">

                  {isPairSelected? (
                    <div className='flex flex-col gap-1'>
                      <div className='flex flex-row justify-between items-start mb-5'>
                        <div className='flex flex-col'>
                          <span>Balance: {PAIR_BALANCE}</span>
                          <span>Staked: {PAIR_STAKED}</span>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                          <select
                            value={pair}
                            onChange={(e) => {
                              setPair(e.target.value);
                            }}
                            className='bg-slate-100 px-4 py-2 rounded-full'
                          >
                            <option value="a">{GOV_TOKEN_SYMBOL}/ETH</option>
                            <option value="b">{GOV_TOKEN_SYMBOL}/DAI</option>
                          </select>
                          <a /* replace w pair addr */
                          href="https://info.uniswap.org/pairs#/pools/0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8" 
                          target='_blank'
                          ><HiOutlineExternalLink className='text-2xl'/></a>
                        </div>
                      </div>

                      <div className='flex justify-center gap-2 items-center w-full'>
                        <input type="number" className='w-20 bg-slate-100 text-center text-clip rounded-full px-1' value={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                        <input className='cursor-pointer w-full' type="range" min={0} max={PAIR_BALANCE} step="0.001" /* getdecimals */ defaultValue={amountToStake} onMouseUp={(e) => {
                          //@ts-ignore
                          setAmountToStake(Number(e.target.value)
                        )}}/>
                        <span className='w-36 bg-slate-100 text-center text-clip rounded-full px-1'>{PAIR_BALANCE}</span>
                      </div>

                    </div>
/*  */
                  ) : (
/*  */
                    <div className='flex flex-col gap-1'>
                      <div className='flex flex-col mb-5'>
                        <span>Balance: {HBT_BALANCE}</span>
                        <span>Staked: {HBT_STAKED}</span>
                      </div>
                      <div className='flex justify-center gap-2 items-center w-full'>
                        <input type="number" className='w-20 bg-slate-100 text-center text-clip rounded-full px-1' value={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                        <input className='cursor-pointer w-full' type="range" min={0} max={HBT_BALANCE} step={0.1^GOV_TOKEN_DECIMALS} defaultValue={amountToStake} value={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                        <span className='w-36 bg-slate-100 text-center text-clip rounded-full px-1'>{HBT_BALANCE}</span>
                      </div>
                    </div>
                  )
                  }
                </div>
                {/*footer*/}
                <div className='flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b'>
                  <div className='flex flex-col'>
                    <span>New Balance: {100}</span>
                    <span>New Stake: {amountToStake}</span>
                  </div>
                  <button onClick={() => setShowModal(false)}>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      

    {/* voting power display */}
    <div className='h-fit w-fit bg-white rounded-3xl flex flex-col gap-1 p-3'>
      <div className='w-full text-center'>
        <h4>
          Voting Power
        </h4>
      </div>
      <div>Voting Power: {POWER} 🌱</div>
      <ul className='list-disc list-inside'>Staked:
        <li>{HBT_STAKED} HBT</li>
        <li>{HBT_ETH_PAIR_STAKED} HBT/ETH</li>
      </ul>
      <button onClick={() => setShowModal(true)}>Manage</button>
    </div>

    </main>
  )
}

export default VotingPower


/*     <div className='h-72 w-96 border-2 border-black rounded-3xl'>
      <div className='flex flex-row justify-evenly divide-x-2 divide-gray-200 p-1 border-b-2 border-gray-200'>
        <div className='w-1/2 text-center'>Single gov token</div>
        <div className='w-1/2 text-center'>UniV3 pair</div>
      </div>
      <div className='box flex flex-col gap-1 py-3'>
        <div>Voting Power: {POWER} 🌱</div>
        <div>Balance: {balance} HBT</div>
        <div>Staked: {staked} HBT</div>
        
      </div>

    </div> */