
import { Falsy, Params, QueryParams, TransactionOptions, useCall, useContractFunction } from '@usedapp/core'
import { Contract, utils } from 'ethers'

import { Storage, Storage__factory } from '../types/ethers-contracts'
const StorageInterface = new utils.Interface(Storage__factory.abi)


export const useStorage_retrieve = (
  contractAddress: Falsy | string,
  args: Falsy | Params<Storage, 'retrieve'>,
  queryParams: QueryParams = {}
) => {
  return useCall<Storage, 'retrieve'>(
    contractAddress
      && args
      && {
        contract: new Contract(contractAddress, StorageInterface) as Storage,
        method: 'retrieve',
        args
      }, queryParams
  )
}


export const useStorage_store = (
  contractAddress: Falsy | string,
  options?: TransactionOptions
) => {
  return useContractFunction<Storage, 'store'>(
    contractAddress && new Contract(contractAddress, StorageInterface) as Storage,
    'store',
    options
  )
}

export const useStorage = {
  retrieve: useStorage_retrieve,
  store: useStorage_store
}
