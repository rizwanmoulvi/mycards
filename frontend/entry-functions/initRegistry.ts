import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type InitRegistryArguments = {
  moduleAddress: `0x${string}`;
};

export const initRegistry = (args: InitRegistryArguments): InputTransactionData => {
  const { moduleAddress } = args;
  return {
    data: {
      function: `${moduleAddress}::CardManager::init_registry`,
      functionArguments: [],
    },
  };
};