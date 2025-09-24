import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { getAccountAPTBalance, getAccountUSDCBalance } from "@/view-functions/getAccountBalance";
import { Card } from "@/components/ui/card";
import { aptosClient } from "@/utils/aptosClient";

export function BalanceDisplay() {
  const { account } = useWallet();
  const [aptBalance, setAptBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<any[]>([]);
  
  const { data, isLoading } = useQuery({
    queryKey: ["account-balances", account?.address],
    refetchInterval: 10_000,
    enabled: !!account,
    queryFn: async () => {
      try {
        if (!account) {
          throw new Error("Account not available");
        }
      
        const [aptBalanceResult, usdcBalanceResult, tokensResult] = await Promise.allSettled([
          getAccountAPTBalance({ accountAddress: account.address.toStringLong() }),
          getAccountUSDCBalance({ accountAddress: account.address.toStringLong() }),
          aptosClient().getAccountOwnedTokens({
            accountAddress: account.address.toStringLong(),
          })
        ]);

        const aptBalance = aptBalanceResult.status === 'fulfilled' ? aptBalanceResult.value : 0;
        const usdcBalance = usdcBalanceResult.status === 'fulfilled' ? usdcBalanceResult.value : -1; // -1 indicates not available
        const tokens = tokensResult.status === 'fulfilled' ? tokensResult.value : [];

        console.log("Owned tokens:", tokens);

        return {
          aptBalance,
          usdcBalance,
          tokens,
        };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching balances",
          description: error.message || "Failed to fetch account balances",
        });
        return {
          aptBalance: 0,
          usdcBalance: -1,
          tokens: [],
        };
      }
    },
  });

  useEffect(() => {
    if (data) {
      setAptBalance(data.aptBalance);
      setUsdcBalance(data.usdcBalance);
      setTokens(data.tokens);
    }
  }, [data]);

  if (!account) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Connect your wallet to view balances</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">Account Balances</h4>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading balances...</p>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">APT:</span>
              <span className="text-sm">{(aptBalance / Math.pow(10, 8)).toFixed(4)} APT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">USDC:</span>
              <span className="text-sm">
                {usdcBalance === -1 ? (
                  <span className="text-muted-foreground">Not Available</span>
                ) : (
                  `${(usdcBalance / Math.pow(10, 6)).toFixed(2)} USDC`
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Owned Tokens:</span>
              <span className="text-sm">{tokens.length} Tokens</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}