import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { MODULE_ADDRESS } from "../constants";
import { initRegistry } from "../entry-functions/initRegistry";
import { createCard } from "../entry-functions/createCard";
import { depositToCard } from "../entry-functions/depositToCard";
import { withdrawFromCard } from "../entry-functions/withdrawFromCard";
import { sendFromCard } from "../entry-functions/sendFromCard";
import { getCardBalance } from "../view-functions/getCardBalance";
import { isRegistryInitialized } from "../view-functions/isRegistryInitialized";
import { getTotalCards } from "../view-functions/getTotalCards";
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Send, RefreshCw, CheckCircle } from "lucide-react";
import { CardsDisplay } from "./CardsDisplay";
import { GoogleWalletShowcase } from "./GoogleWalletShowcase";

export function CardManager() {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [cardId, setCardId] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [cardBalance, setCardBalance] = useState<number | null>(null);
  const [balanceCardId, setBalanceCardId] = useState("");
  const [registryInitialized, setRegistryInitialized] = useState<boolean | null>(null);
  const [totalCards, setTotalCards] = useState<number | null>(null);

  // Check registry status on component mount
  useEffect(() => {
    const checkRegistryStatus = async () => {
      if (!MODULE_ADDRESS) {
        console.log("MODULE_ADDRESS not found:", MODULE_ADDRESS);
        return;
      }
      
      try {
        console.log("Checking registry status for address:", MODULE_ADDRESS);
        const initialized = await isRegistryInitialized({
          moduleAddress: MODULE_ADDRESS as `0x${string}`,
        });
        console.log("Registry initialized:", initialized);
        setRegistryInitialized(initialized);

        if (initialized) {
          const total = await getTotalCards({
            moduleAddress: MODULE_ADDRESS as `0x${string}`,
          });
          console.log("Total cards:", total);
          setTotalCards(total);
        }
      } catch (error) {
        console.error("Error checking registry status:", error);
        setRegistryInitialized(false);
      }
    };

    checkRegistryStatus();
  }, []);

  const handleTransaction = async (transactionData: any, successMessage: string) => {
    if (!account) {
      toast({
        title: "Error",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await signAndSubmitTransaction(transactionData);
      toast({
        title: "Success",
        description: successMessage,
      });
      console.log("Transaction response:", response);
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Error",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitRegistry = async () => {
    if (!MODULE_ADDRESS) {
      toast({
        title: "Error",
        description: "Module address not configured.",
        variant: "destructive",
      });
      return;
    }

    const transactionData = initRegistry({
      moduleAddress: MODULE_ADDRESS as `0x${string}`,
    });

    await handleTransaction(transactionData, "Registry initialized successfully!");
  };

  const handleCreateCard = async () => {
    if (!MODULE_ADDRESS || !ownerAddress) {
      toast({
        title: "Error",
        description: "Please provide owner address.",
        variant: "destructive",
      });
      return;
    }

    const transactionData = createCard({
      moduleAddress: MODULE_ADDRESS as `0x${string}`,
      owner: ownerAddress as `0x${string}`,
    });

    await handleTransaction(transactionData, "Card created successfully!");
    setOwnerAddress("");
  };

  const handleDeposit = async () => {
    if (!MODULE_ADDRESS || !cardId || !amount) {
      toast({
        title: "Error",
        description: "Please provide card ID and amount.",
        variant: "destructive",
      });
      return;
    }

    // Convert APT to octas (1 APT = 100,000,000 octas)
    const amountInOctas = (parseFloat(amount) * 100_000_000).toString();

    const transactionData = depositToCard({
      moduleAddress: MODULE_ADDRESS as `0x${string}`,
      cardId,
      amount: amountInOctas,
    });

    await handleTransaction(transactionData, `Deposited ${amount} APT to card ${cardId}!`);
    setAmount("");
  };

  const handleWithdraw = async () => {
    if (!MODULE_ADDRESS || !cardId || !amount) {
      toast({
        title: "Error",
        description: "Please provide card ID and amount.",
        variant: "destructive",
      });
      return;
    }

    // Convert APT to octas (1 APT = 100,000,000 octas)
    const amountInOctas = (parseFloat(amount) * 100_000_000).toString();

    const transactionData = withdrawFromCard({
      moduleAddress: MODULE_ADDRESS as `0x${string}`,
      cardId,
      amount: amountInOctas,
    });

    await handleTransaction(transactionData, `Withdrew ${amount} APT from card ${cardId}!`);
    setAmount("");
  };

  const handleSend = async () => {
    if (!MODULE_ADDRESS || !cardId || !amount || !recipientAddress) {
      toast({
        title: "Error",
        description: "Please provide card ID, recipient address, and amount.",
        variant: "destructive",
      });
      return;
    }

    // Convert APT to octas (1 APT = 100,000,000 octas)
    const amountInOctas = (parseFloat(amount) * 100_000_000).toString();

    const transactionData = sendFromCard({
      moduleAddress: MODULE_ADDRESS as `0x${string}`,
      cardId,
      to: recipientAddress as `0x${string}`,
      amount: amountInOctas,
    });

    await handleTransaction(transactionData, `Sent ${amount} APT from card ${cardId} to ${recipientAddress}!`);
    setAmount("");
    setRecipientAddress("");
  };

  const handleGetBalance = async () => {
    if (!MODULE_ADDRESS || !balanceCardId) {
      toast({
        title: "Error",
        description: "Please provide card ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const balance = await getCardBalance({
        moduleAddress: MODULE_ADDRESS as `0x${string}`,
        cardId: balanceCardId,
      });
      
      // Convert from octas to APT (1 APT = 100,000,000 octas)
      const balanceInAPT = balance / 100_000_000;
      setCardBalance(balanceInAPT);
      
      toast({
        title: "Balance Retrieved",
        description: `Card ${balanceCardId} balance: ${balanceInAPT} APT`,
      });
    } catch (error) {
      console.error("Error getting balance:", error);
      toast({
        title: "Error",
        description: "Failed to get card balance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CreditCard className="h-8 w-8" />
          Card Manager
        </h1>
        <p className="text-muted-foreground">
          Manage your virtual cards on the Aptos blockchain
        </p>
        {registryInitialized !== null && (
          <div className="flex items-center justify-center gap-2 text-sm">
            {registryInitialized ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">
                  Registry Active • {totalCards} cards created
                </span>
              </>
            ) : (
              <span className="text-yellow-600">Registry needs initialization</span>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Initialize Registry - only show if not initialized */}
        {registryInitialized === false && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Initialize Registry
              </CardTitle>
              <CardDescription>
                Initialize the card registry (admin only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleInitRegistry} 
                disabled={isLoading}
                className="w-full"
              >
                Initialize Registry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Create Card
            </CardTitle>
            <CardDescription>
              Create a new virtual card for an owner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="owner-address">Owner Address</Label>
              <Input
                id="owner-address"
                placeholder="0x..."
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleCreateCard} 
              disabled={isLoading || !ownerAddress}
              className="w-full"
            >
              Create Card
            </Button>
          </CardContent>
        </Card>

        {/* Get Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Check Balance
            </CardTitle>
            <CardDescription>
              Check the balance of a card
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="balance-card-id">Card ID</Label>
              <Input
                id="balance-card-id"
                placeholder="1"
                value={balanceCardId}
                onChange={(e) => setBalanceCardId(e.target.value)}
              />
            </div>
            {cardBalance !== null && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Balance: {cardBalance} APT</p>
              </div>
            )}
            <Button 
              onClick={handleGetBalance} 
              disabled={isLoading || !balanceCardId}
              className="w-full"
            >
              Get Balance
            </Button>
          </CardContent>
        </Card>

        {/* Deposit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5" />
              Deposit
            </CardTitle>
            <CardDescription>
              Deposit APT to a card
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deposit-card-id">Card ID</Label>
              <Input
                id="deposit-card-id"
                placeholder="1"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deposit-amount">Amount (APT)</Label>
              <Input
                id="deposit-amount"
                placeholder="1.0"
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleDeposit} 
              disabled={isLoading || !cardId || !amount}
              className="w-full"
            >
              Deposit
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5" />
              Withdraw
            </CardTitle>
            <CardDescription>
              Withdraw APT from your card
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="withdraw-card-id">Card ID</Label>
              <Input
                id="withdraw-card-id"
                placeholder="1"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="withdraw-amount">Amount (APT)</Label>
              <Input
                id="withdraw-amount"
                placeholder="1.0"
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleWithdraw} 
              disabled={isLoading || !cardId || !amount}
              className="w-full"
            >
              Withdraw
            </Button>
          </CardContent>
        </Card>

        {/* Send */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send
            </CardTitle>
            <CardDescription>
              Send APT from your card to another address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="send-card-id">Card ID</Label>
              <Input
                id="send-card-id"
                placeholder="1"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="recipient-address">Recipient Address</Label>
              <Input
                id="recipient-address"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="send-amount">Amount (APT)</Label>
              <Input
                id="send-amount"
                placeholder="1.0"
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !cardId || !amount || !recipientAddress}
              className="w-full"
            >
              Send
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cards Display Section */}
      <CardsDisplay />

      {/* Google Wallet Integration Showcase */}
      <GoogleWalletShowcase />

      {!account && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-center text-yellow-800">
              Please connect your wallet to interact with the Card Manager
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}