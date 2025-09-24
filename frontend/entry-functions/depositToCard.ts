import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type DepositToCardArguments = {
  moduleAddress: `0x${string}`;
  cardId: string;
  amount: string; // Amount in octas (1 APT = 100,000,000 octas)
};

export const depositToCard = (args: DepositToCardArguments): InputTransactionData => {
  const { moduleAddress, cardId, amount } = args;
  return {
    data: {
      function: `${moduleAddress}::CardManager::deposit`,
      functionArguments: [cardId, amount],
    },
  };
};