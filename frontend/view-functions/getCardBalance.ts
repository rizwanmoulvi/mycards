import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = (process.env.VITE_APP_NETWORK as Network) || Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export type GetCardBalanceArguments = {
  moduleAddress: `0x${string}`;
  cardId: string;
};

export const getCardBalance = async ({
  moduleAddress,
  cardId,
}: GetCardBalanceArguments): Promise<number> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${moduleAddress}::CardManager::get_balance`,
        functionArguments: [cardId],
      },
    });
    
    // Result is in octas (1 APT = 100,000,000 octas)
    return result[0] as number;
  } catch (error) {
    console.error("Error fetching card balance:", error);
    throw new Error("Failed to fetch card balance");
  }
};