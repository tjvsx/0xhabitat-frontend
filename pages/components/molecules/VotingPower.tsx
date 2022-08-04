import type { NextComponentType, NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { MouseEvent, SetStateAction, useState } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import Slider from '../atoms/Slider'

import { useMockERC20 } from '../../../gen/hooks/MockERC20'
import { useWETH } from '../../../gen/hooks/WETH'
import NETMAP from '../../../contracts/addressesMap.json'

//@ts-ignore
import { Switch, Select, Button } from "agnostic-react";
// import "agnostic-react/dist/common.min.css";
import "agnostic-react/dist/esm/index.css";
import { BigNumber } from 'ethers'
import { useNonfungiblePositionManager } from '../../../gen/hooks/NonfungiblePositionManager'
import { useStakeContractERC20UniV3 } from '../../../gen/hooks/StakeContractERC20UniV3'

const VotingPower: NextComponentType = () => {

  const { account, library, activateBrowserWallet } = useEthers()
  const ERC20 = NETMAP.hbtERC20;
  
  // const { send: store, state: storeState } = useMockERC20.store('0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3')

  
  interface token {
    name?: [string];
    symbol?: [string];
    decimals?: [number];
    supply?: [BigNumber];
    balance?: [BigNumber];
    staked?: [BigNumber];
  }
  const token:token = {
    name: (useMockERC20.name(ERC20, []) || {}).value,
    symbol: (useMockERC20.symbol(ERC20, []) || {}).value,
    decimals: (useMockERC20.decimals(ERC20, []) || {}).value,
    supply: (useMockERC20.totalSupply(ERC20, []) || {}).value,
    balance: (useMockERC20.balanceOf(ERC20, [account || '']) || {}).value,
    staked: (useStakeContractERC20UniV3.getStakedBalanceOfGovernanceToken(NETMAP.stakeContractERC20UniV3, [account || '']) || {}).value
  }

  const positions = (useStakeContractERC20UniV3.getAmountOfStakedNFTPositions(NETMAP.stakeContractERC20UniV3, [account || '']) || {}).value
  console.log('positions', positions)



  interface pair {
    balance?: [BigNumber];
  }
  const pair:pair = {
    /* TODO */
    balance: (useMockERC20.balanceOf(ERC20, [account || '']) || {}).value
  }

  // const {value: staked} = useStakeContractERC20UniV3.getStakedBalanceOfGovernanceToken(NETMAP.stakeContractERC20UniV3, [account || '']) || {}
  // console.log(staked)

  const TOKEN_ETH_PAIR_STAKED = 0.8;
  const POWER = 80000;

  const PAIR_BALANCE = 0.8;
  const PAIR_STAKED = 1.4;

  /* state funcs */
  const [showModal, setShowModal] = useState(true);
  const [isPairSelected, setPairSelected] = useState(false)
  const [selectedPair, setSelectedPair] = useState("TOKEN/ETH");
  const [amountToStake, setAmountToStake] = useState(0);
  const [stake, setAction] = useState(false)
  async function managePairs() {
    setPairSelected(true);
    setAmountToStake(0);
  }

  async function manageToken() {
    setPairSelected(false);
    setAmountToStake(0);
  }

  return (
    <main>

      {showModal && !Object.values(token).includes(undefined) ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative my-6 mx-auto max-w-3xl w-96">
              
              <div onClick={() => {setShowModal(false)}} className='flex justify-center items-center w-7 h-7 bg-slate-400 rounded-full absolute right-[-0.75em] top-[-0.75em] z-50 cursor-pointer'>&#10005;</div>
                {/*content*/}
                <div className="shadow-lg relative flex flex-col w-full divide-y p-2 bg-gray-800">
                  {/*header*/}
                  <div className="flex justify-evenly divide-x p-2">
                    <div 
                      className='w-1/2 text-center cursor-pointer truncate'
                      style={{textDecoration: isPairSelected ? '' : 'underline'}}
                      onClick={() => manageToken()}
                    >
                      {token.name}
                    </div>
                    <div 
                      className='w-1/2 text-center cursor-pointer truncate'                     
                      style={{textDecoration: isPairSelected ? 'underline' : ''}}
                      onClick={() => managePairs()}
                    >
                      UniV3 Pairs
                    </div>
                  </div>

                  {/*info*/}
                  <div className="relative p-5 flex flex-col h-28 justify-between">

                    <div className='absolute right-4 top-4'>
                      <Switch id={2} isChecked={stake} onChange={()=>{setAction(!stake)}} />
                    </div>

                    {isPairSelected? (
                      <>
                      <div className='flex flex-col'>
                        <span>Balance: {PAIR_BALANCE}</span>
                        <span>Staked: {PAIR_STAKED}</span>
                        <div className='flex flex-row items-center gap-2 absolute bottom-4 right-4'>
                          <Select
                            onChange={(e: { target: { value: SetStateAction<string> } }) => {setSelectedPair(e.target.value)}}
                            options={
                              [
                                { value: `${token.symbol}/ETH`, label: `${token.symbol}/ETH` }, 
                                { value: `${token.symbol}/DAI`, label: `${token.symbol}/DAI`},
                              ]} 
                            uniqueId="habitat-select-pair" 
                            name="Select Pair"
                            labelCopy="Select Pair"
                            defaultOptionLabel="Select Pair"
                            size="small"
                            />
                          <a /* replace w pair addr */
                          href="https://info.uniswap.org/pairs#/pools/0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8" 
                          target='_blank'
                          ><HiOutlineExternalLink className='text-2xl'/></a>
                        </div>
                      </div>
                      </>
                    ) : (
                      <>
                        <div className='flex flex-col mb-5 w-48 overflow-x-scroll'>
                        <span>Balance: {Number(token.balance)}</span>
                        <span>Staked: {Number(token.staked)}</span>
                      </div>
                      </>
                    )}
                  </div>

                  {/* slider */}
                  <div className='relative flex justify-center gap-2 items-center w-full py-4'>
                  { isPairSelected? (
                    //display pairs slider

                    <>
                      <Slider max={Number(pair.balance)} min={0} value={amountToStake} step={0.1^(Number(token.decimals))} callback={setAmountToStake}/>

                      {/* <input type="number" className='w-20 text-center text-clip rounded-full px-1' value={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                      <input className='cursor-pointer w-full' type="range" min={0} max={Number(token.balance)} step={0.1^(Number(token.decimals))} defaultValue={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                      <span className='w-36 text-center text-clip rounded-full px-1 overflow-x-scroll'>{Number(token.balance)}</span> */}
                    </>
                    ) : (
                    //display erc20 slider
                    <>
                      <Slider max={Number(token.balance)} min={0} value={amountToStake} step={0.1^(Number(token.decimals))} callback={setAmountToStake}/>
                      {/* <input type="number" className='w-20 text-center text-clip rounded-full px-1' value={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                      <input className='cursor-pointer w-full' type="range" min={0} max={Number(token.balance)} step={0.1^(Number(token.decimals))} defaultValue={amountToStake} onChange={(e) => {setAmountToStake(Number(e.target.value))}}/>
                      <span className='w-36 text-center text-clip rounded-full px-1 overflow-x-scroll'>{Number(token.balance)}</span> */}
                    </>
                    )}
                  </div>

                  {/*footer*/}
                  <div className='flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b'>
                  {stake? (
                    <>
                      <div className='flex flex-col'>
                        <span className='whitespace-nowrap'>To Stake: {amountToStake.toPrecision(4)}</span>
                      </div>
                      <Button mode='primary' onClick={() => setShowModal(false)}>
                        Approve
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className='flex flex-col'>
                        <span className='whitespace-nowrap'>To Unstake: {amountToStake.toPrecision(4)}</span>
                      </div>
                      <Button mode='primary' onClick={() => setShowModal(false)}>
                        Unstake
                      </Button>
                    </>
                  )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      

    {/* voting power display */}
    <div className='h-fit w-fit flex flex-col gap-1 p-3 bg-slate-800'>
      <div className='w-full text-center'>
        <h4>
          Voting Power
        </h4>
      </div>
      <div>Voting Power: {POWER} 🌱</div>
      <ul className='list-disc list-inside'>Staked:
        <li>{Number(token.staked)} {token.symbol}</li>
        <li>{TOKEN_ETH_PAIR_STAKED} {token.symbol}/ETH</li>
      </ul>
      <Button mode="primary" onClick={() => setShowModal(true)}>Manage</Button>
    </div>

    </main>
  )
}

export default VotingPower
