import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CreditCardDisplay } from "./CreditCardDisplay";
import { MODULE_ADDRESS } from "../constants";
import { getAllCardIds } from "../view-functions/getAllCardIds";
import { getCardDetails, CardDetails } from "../view-functions/getCardDetails";
import { CreditCard, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export function CardsDisplay() {
  const { account } = useWallet();
  const { toast } = useToast();
  
  const [cards, setCards] = useState<CardDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllCards = async () => {
    if (!MODULE_ADDRESS) {
      setError("Module address not configured");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get all card IDs
      const cardIds = await getAllCardIds({
        moduleAddress: MODULE_ADDRESS as `0x${string}`,
      });

      if (cardIds.length === 0) {
        setCards([]);
        return;
      }

      // Get details for each card
      const cardDetailsPromises = cardIds.map(async (cardId) => {
        return await getCardDetails({
          moduleAddress: MODULE_ADDRESS as `0x${string}`,
          cardId: cardId.toString(),
        });
      });

      const allCardDetails = await Promise.all(cardDetailsPromises);
      setCards(allCardDetails);

    } catch (error) {
      console.error("Error fetching cards:", error);
      setError("Failed to fetch cards");
      toast({
        title: "Error",
        description: "Failed to fetch cards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch cards on component mount
  useEffect(() => {
    fetchAllCards();
  }, []);

  // Separate user's cards from other cards
  const userCards = cards.filter(card => account && card.owner.toLowerCase() === account.address.toString().toLowerCase());
  const otherCards = cards.filter(card => !account || card.owner.toLowerCase() !== account.address.toString().toLowerCase());

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Virtual Cards
            </CardTitle>
            <CardDescription>
              {cards.length === 0 ? "No cards created yet" : `${cards.length} card${cards.length === 1 ? '' : 's'} total`}
            </CardDescription>
          </div>
          <Button
            onClick={fetchAllCards}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchAllCards} className="mt-2" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {isLoading && cards.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading cards...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No cards created yet</p>
            <p className="text-sm text-muted-foreground">Create your first virtual card to get started!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User's Cards */}
            {userCards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Your Cards ({userCards.length})
                </h3>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {userCards.map((card) => (
                    <CreditCardDisplay
                      key={card.id}
                      id={card.id}
                      owner={card.owner}
                      balance={card.balance}
                      isOwnCard={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Cards */}
            {otherCards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  All Cards ({otherCards.length})
                </h3>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {otherCards.map((card) => (
                    <CreditCardDisplay
                      key={card.id}
                      id={card.id}
                      owner={card.owner}
                      balance={card.balance}
                      isOwnCard={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}