import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = (process.env.VITE_APP_NETWORK as Network) || Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export type GetTotalCardsArguments = {
  moduleAddress: `0x${string}`;
};

export const getTotalCards = async ({
  moduleAddress,
}: GetTotalCardsArguments): Promise<number> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${moduleAddress}::CardManager::get_total_cards`,
        functionArguments: [],
      },
    });
    
    return result[0] as number;
  } catch (error) {
    console.error("Error fetching total cards:", error);
    throw new Error("Failed to fetch total cards");
  }
};