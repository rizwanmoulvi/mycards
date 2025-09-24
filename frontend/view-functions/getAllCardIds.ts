import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = (process.env.VITE_APP_NETWORK as Network) || Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export type GetAllCardIdsArguments = {
  moduleAddress: `0x${string}`;
};

export const getAllCardIds = async ({
  moduleAddress,
}: GetAllCardIdsArguments): Promise<number[]> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${moduleAddress}::CardManager::get_all_card_ids`,
        functionArguments: [],
      },
    });
    
    return result[0] as number[];
  } catch (error) {
    console.error("Error fetching all card IDs:", error);
    throw new Error("Failed to fetch all card IDs");
  }
};