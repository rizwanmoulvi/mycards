import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = (process.env.VITE_APP_NETWORK as Network) || Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export type GetCardDetailsArguments = {
  moduleAddress: `0x${string}`;
  cardId: string;
};

export interface CardDetails {
  id: number;
  owner: string;
  balance: number; // in octas
}

export const getCardDetails = async ({
  moduleAddress,
  cardId,
}: GetCardDetailsArguments): Promise<CardDetails> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${moduleAddress}::CardManager::get_card_details`,
        functionArguments: [cardId],
      },
    });
    
    const [id, owner, balance] = result as [number, string, number];
    
    return {
      id,
      owner,
      balance,
    };
  } catch (error) {
    console.error("Error fetching card details:", error);
    throw new Error("Failed to fetch card details");
  }
};