import type { NextComponentType, NextPage } from 'next';

import { Dialog, Menu, Switch, Transition } from "@headlessui/react";

import { useEthers, useToken, useTokenBalance, useTokenAllowance, useConfig, useCalls, Call } from '@usedapp/core'
import { MouseEvent, SetStateAction, useState, useRef, Fragment, useEffect } from 'react'
import { HiOutlineExternalLink, HiOutlineClipboard } from 'react-icons/hi'

import { useMockERC20 } from '../../../gen/hooks/MockERC20'
import NETMAP from '../../contracts/_map.json'

import { useNonfungiblePositionManager } from '../../../gen/hooks/NonfungiblePositionManager';
import { useStakeContractERC20UniV3 } from '../../../gen/hooks/StakeContractERC20UniV3'
import { useMockVotingPowerHolder } from '../../../gen/hooks/MockVotingPowerHolder'
import { formatUnits } from '@ethersproject/units'
import { BigNumber } from "@ethersproject/bignumber";
import { Bytes, hexValue, isBytes, isBytesLike } from "@ethersproject/bytes";
import { Contract } from '@ethersproject/contracts';
import NFPM_ABI from '../../contracts/NFPM.json'
const NFPM_ADDR = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const VotingPower: NextComponentType = () => {

  const { account, library, activateBrowserWallet } = useEthers();
  // const { networks } = useConfig();
  console.log('networks', library)
  const tokenAddr = NETMAP.hbtERC20;

  const token =  useToken(tokenAddr)
  const tokenBalance = useTokenBalance(tokenAddr, account)
  const tokenAllowance = useTokenAllowance(tokenAddr, account, NETMAP.stakeContractERC20UniV3);

  // console.log('allowance', tokenAllowance)

  const votingPower = account && (useMockVotingPowerHolder.votingPower(NETMAP.votingPowerHolder, [account]) || {}).value?.[0]
  // console.log('voting power', votingPower && formatUnits(votingPower, 18))

  const tokenStaked = account && (useStakeContractERC20UniV3.getStakedBalanceOfGovernanceToken(NETMAP.stakeContractERC20UniV3, [account]) || {}).value
  // console.log(tokenStaked?.balance)

  //display accepted pairs 
  const legalPairs = account && (useStakeContractERC20UniV3.getLegalPairTokens(NETMAP.stakeContractERC20UniV3, []) || {}).value?.[0];
  // console.log('legal pairs', legalPairs);

  //display user's pairs from uniswap
  

  //display user's existing pairs staked
  const _stakedLPs = account && (useStakeContractERC20UniV3.getAllNFTPositionIdsOfHolder(NETMAP.stakeContractERC20UniV3, [account]) || {}).value?.[0];
  // console.log('asdf positions', positionsHeld)

  const listItems = _stakedLPs && _stakedLPs.map((position) => {
    return (<li>1x <a href={`https://app.uniswap.org/#/pool/${position.toNumber()}?chain=${'optimism'}`}> {position.toNumber()}</a></li>);
  });

  function getUserLPs() {
    const total = account && (useNonfungiblePositionManager.balanceOf(NFPM_ADDR, [account]) || {}).value?.[0];
    const length = total && total.toNumber()
    let calls:Call[];

    calls = [];
    for (let i = 0; i < length!; i++) {
      calls.push({
        contract: new Contract(NFPM_ADDR, NFPM_ABI),
        method: 'tokenOfOwnerByIndex',
        args: [account, i]
      })
    }
    const ids = useCalls(calls) ?? [];

    calls = [];
    ids.forEach((id, i) => {
      calls.push({
        contract: new Contract(NFPM_ADDR, NFPM_ABI),
        method: 'positions',
        args: [id && id.value?.[0]]
      })
    })
    const info = useCalls(calls) ?? [];

    return info.map(i => i?.value);
  }

  const _LPs = getUserLPs();
  console.log('LP', _LPs)

  // const tokenIdsHeld = LPsHeld && (useNonfungiblePositionManager.tokenOfOwnerByIndex(NFPM_ADDR, [account, LPsHeld]) || {}).value?.[0];
  // console.log('Ids held', tokenIdsHeld)


  // const legalPairsHeld = positionsHeld && useNonfungiblePositionManager.allPositions("0xC36442b4a4522E871399CD717aBDD847Ab11FE88", [positionsHeld]);
  // console.log('legal pairs held', legalPairsHeld);

  // const test = useNonfungiblePositionManager.positions("0xC36442b4a4522E871399CD717aBDD847Ab11FE88", [positionsHeld?.[0]]);
  // console.log('asdf test', test);


  // TODO: 
  // get legalpairs
  // call NFPositionManager -- check for govtoken/legalpair nfts
  // OR propose him to provide liquidty and then stake

  const TOKEN_ETH_PAIR_STAKED = 0.8;
  const POWER = 80000;

  const PAIR_BALANCE = 0.8;
  const PAIR_STAKED = 1.4;

  /* state funcs */
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const [enabled, setEnabled] = useState(true)
  const [amountToStake, setAmountToStake] = useState(BigNumber.from(0));
  const [selected, setSelected] = useState(NETMAP.hbtERC20);

  const { send: ERC20_approve, state: ERC20_approval } = useMockERC20.approve(NETMAP.hbtERC20)

  async function handleClick() {
    //if token selected--
    if (selected === NETMAP.hbtERC20) {
      ERC20_approve(NETMAP.stakeContractERC20UniV3, amountToStake);
    } else if (selected === 'PAIR_ADDR_1') {
      alert('pair functionality not implemented yet')
    }
  }

  // console.log('selected', selected)

  return (
  <>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gray-300 p-6 text-left align-middle shadow-xl transition-all">
                <div className='mt-[-1.5rem] p-1 flex flex-col gap-2'>
                  <div className='flex flex-row items-center justify-start w-fit pl-1 py-2 gap-2'>
                    <select 
                    className='form-select appearance-none block w-full text-xl px-3 py-2 font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:outline-none outline-none'
                    onChange={(e) => setSelected(e.target.value)}
                    >
                      <option value={NETMAP.hbtERC20}>{token?.name} ({token?.symbol})</option>
                      <option value="PAIR_ADDR_1">HBT/ETH</option>
                      <option value="ETC">HBT/DAI</option>
                    </select>
                    <a
                    href="https://info.uniswap.org/pairs#/pools/0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8" 
                    target='_blank'
                    ><HiOutlineExternalLink className='text-3xl'/></a>
                  </div>
                  <div className='flex w-full items-center justify-between rounded-full p-4 bg-gray-200'>
                    <input type="number" placeholder="0.0" className='bg-transparent w-full outline-none appearance-none text-3xl' onChange={(e) => {setAmountToStake(BigNumber.from(e.target.value))}}/>
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      className={`${enabled ? 'bg-green-400 bg-opacity-50' : 'bg-red-400 bg-opacity-50'}
                        relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${enabled ? 'translate-x-[1em] bg-green-400 bg-deposit' : 'translate-x-[-1em] bg-red-400 bg-withdraw'} bg-cover bg-no-repeat
                        translate-y-[-0.5em] pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <span className='flex flex-row flex-nowrap justify-end'>
                    {tokenBalance && 
                      <p className='truncate w-48'>{token?.symbol} balance: {formatUnits(tokenBalance, token?.decimals)}</p>
                    }
                  </span>

                  <button
                  className="w-full p-4 text-2xl rounded-full bg-black text-white"
                  onClick={handleClick}
                  >
                    APPROVE
                  </button>
                
                </div> 
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>



    {/* voting power display */}
    <div className="w-fit flex-col justify-center items-center text-center p-4 bg-white rounded-3xl">
      <h4>
        Voting Power
      </h4>
      <div>
        {votingPower && 
            <div className='w-full text-xl'>
              {Number(formatUnits(votingPower, token?.decimals)).toPrecision(10)} 🌱
            </div>
        }
        
        {tokenStaked && 
          <ul className='list-disc list-inside text-left'>
            Staked: 
            <li className='w-52'>
              {Number(formatUnits(tokenStaked?.balance, token?.decimals))} {token?.symbol}
            </li>
            {listItems}
          </ul>
        }
      </div>
      <button
        type="button"
        onClick={openModal}
        className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        MANAGE
      </button>
    </div>
  </>
  )
}

export default VotingPower
