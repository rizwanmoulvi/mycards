import React from 'react';
import { Button } from './ui/button';
import { Wallet, Copy, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface GoogleWalletButtonProps {
  card: {
    id: number;
    owner: string;
    balance: number;
  };
  variant?: 'full' | 'compact';
  className?: string;
}

export function GoogleWalletButton({ card, variant = 'full', className = '' }: GoogleWalletButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [walletUrl, setWalletUrl] = React.useState<string | null>(null);

  const createWalletPass = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/wallet/create-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: card.id.toString(),
          owner: card.owner,
          balance: card.balance
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setWalletUrl(result.walletUrl);
        return result.walletUrl;
      } else {
        throw new Error(result.error || 'Failed to create wallet pass');
      }
      
    } catch (error) {
      console.error('Error creating wallet pass:', error);
      toast({
        title: "Error",
        description: "Failed to create Google Wallet pass. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWallet = async () => {
    const url = walletUrl || await createWalletPass();
    if (url) {
      window.open(url, '_blank');
      toast({
        title: "Opening Google Wallet",
        description: "Your virtual card is being added to Google Wallet",
      });
    }
  };

  const handleCopyWalletLink = async () => {
    const url = walletUrl || await createWalletPass();
    if (url) {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Google Wallet link copied to clipboard",
      });
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyWalletLink}
          className="px-3 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex gap-2">
        <Button
          onClick={handleAddToWallet}
          disabled={isLoading}
          className="bg-black hover:bg-gray-800 text-white flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Pass...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Add to Google Wallet
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyWalletLink}
          className="px-4"
          disabled={isLoading}
        >
          <Copy className="h-4  w-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}