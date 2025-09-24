import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type SendFromCardArguments = {
  moduleAddress: `0x${string}`;
  cardId: string;
  to: `0x${string}`;
  amount: string; // Amount in octas (1 APT = 100,000,000 octas)
};

export const sendFromCard = (args: SendFromCardArguments): InputTransactionData => {
  const { moduleAddress, cardId, to, amount } = args;
  return {
    data: {
      function: `${moduleAddress}::CardManager::send`,
      functionArguments: [cardId, to, amount],
    },
  };
};