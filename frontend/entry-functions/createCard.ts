import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type CreateCardArguments = {
  moduleAddress: `0x${string}`;
  owner: `0x${string}`;
};

export const createCard = (args: CreateCardArguments): InputTransactionData => {
  const { moduleAddress, owner } = args;
  return {
    data: {
      function: `${moduleAddress}::CardManager::create_card`,
      functionArguments: [owner],
    },
  };
};