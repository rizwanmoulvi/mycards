import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = (process.env.VITE_APP_NETWORK as Network) || Network.TESTNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export type IsRegistryInitializedArguments = {
  moduleAddress: `0x${string}`;
};

export const isRegistryInitialized = async ({
  moduleAddress,
}: IsRegistryInitializedArguments): Promise<boolean> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${moduleAddress}::CardManager::is_registry_initialized`,
        functionArguments: [],
      },
    });
    
    return result[0] as boolean;
  } catch (error) {
    console.error("Error checking registry status:", error);
    return false;
  }
};