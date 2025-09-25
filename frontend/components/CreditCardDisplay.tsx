import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { GoogleWalletButton } from "./GoogleWalletButton";

interface CreditCardProps {
  id: number;
  owner: string;
  balance: number; // in octas
  isOwnCard?: boolean;
}

export function CreditCardDisplay({ id, owner, balance, isOwnCard = false }: CreditCardProps) {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const { toast } = useToast();

  // Convert balance from octas to APT
  const balanceInAPT = balance / 100_000_000;

  // Format address for display
  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };



  return (
    <Card className={`w-80 h-56 relative overflow-hidden ${isOwnCard ? 'bg-gradient-to-br from-gray-600 to-slate-700' : 'bg-gradient-to-br from-gray-600 to-gray-800'} text-white`}>
      <CardContent className="p-6 h-full flex flex-col justify-between">
        {/* Card Header */}
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-none">
              {isOwnCard ? 'Your Card' : 'Card'}
            </Badge>
            <h3 className="text-lg font-semibold mt-1">Virtual Card #{id}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">Balance</p>
            <p className="text-xl font-bold">{balanceInAPT.toFixed(4)} APT</p>
          </div>
        </div>

        {/* Card Middle - Decorative Pattern */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-8 flex items-center justify-center">
            <div className="w-8 h-6  rounded"></div>
               <GoogleWalletButton 
                    card={{ id, owner, balance }} 
                    variant="compact"
                    className="pt-1"
                />
          </div>
        </div>

        {/* Card Footer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Card Owner</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono">{formatAddress(owner)}</p>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {showFullAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => copyToClipboard(owner, "Owner address")}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="text-right text-xs opacity-80">
              <p>Card ID</p>
              <p className="font-mono">{id}</p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full"></div>
      </CardContent>
    </Card>
  );
}