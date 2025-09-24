import { aptosClient } from "@/utils/aptosClient";
import { USDC_TOKEN_ADDRESS } from "@/constants";

export type AccountAPTBalanceArguments = {
  accountAddress: string;
};

export type AccountUSDCBalanceArguments = {
  accountAddress: string;
};

export const getAccountAPTBalance = async (args: AccountAPTBalanceArguments): Promise<number> => {
  const { accountAddress } = args;
  const balance = await aptosClient().view<[number]>({
    payload: {
      function: "0x1::coin::balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [accountAddress],
    },
  });
  return balance[0];
};

export const getAccountUSDCBalance = async (args: AccountUSDCBalanceArguments): Promise<number> => {
  const { accountAddress } = args;
  try {
    const balance = await aptosClient().view<[number]>({
      payload: {
        function: "0x1::coin::balance",
        typeArguments: [USDC_TOKEN_ADDRESS],
        functionArguments: [accountAddress],
      },
    });
    return balance[0];
  } catch (error) {
    // If the account doesn't have USDC registered, return 0
    console.log("USDC balance fetch error (account may not have USDC registered):", error);
    return 0;
  }
};

//usdc testent address "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832"