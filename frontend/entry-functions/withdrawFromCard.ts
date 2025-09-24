import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type WithdrawFromCardArguments = {
  moduleAddress: `0x${string}`;
  cardId: string;
  amount: string; // Amount in octas (1 APT = 100,000,000 octas)
};

export const withdrawFromCard = (args: WithdrawFromCardArguments): InputTransactionData => {
  const { moduleAddress, cardId, amount } = args;
  return {
    data: {
      function: `${moduleAddress}::CardManager::withdraw`,
      functionArguments: [cardId, amount],
    },
  };
};