import React from 'react';
import { Button } from './ui/button';
import { Wallet, Download, ExternalLink, Info } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { GoogleWalletService } from '../services/googleWallet';
import { GoogleWalletDemoService } from '../services/googleWalletDemo';

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
  const [showInstructions, setShowInstructions] = React.useState(false);
  const googleWalletService = new GoogleWalletService();
  const demoService = new GoogleWalletDemoService();

  const handleAddToWallet = async () => {
    setIsLoading(true);
    
    try {
      // Use the demo service to show proper explanation
      const demoResult = await demoService.addToWalletDemo(card);
      
      // Open the production-format URL (this will show the error you encountered)
      const walletUrl = demoService.generateProductionWalletUrl(card);
      window.open(walletUrl, '_blank');
      
      toast({
        title: "Google Wallet Demo",
        description: "This shows the integration format. The error occurs because we need server-side JWT signing for production.",
      });
      
      // Show detailed instructions after a delay
      setTimeout(() => {
        setShowInstructions(true);
        toast({
          title: "Production Setup Required",
          description: "Click the 'Info' button below to see the complete setup steps for real Google Wallet integration.",
          variant: "default",
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Demo Feature",
        description: "This demonstrates Google Wallet integration structure. Production requires server-side implementation.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPass = () => {
    const passUrl = googleWalletService.generateDownloadablePass(card);
    const link = document.createElement('a');
    link.href = passUrl;
    link.download = `virtual-card-${card.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(passUrl);
    
    toast({
      title: "Pass Downloaded",
      description: "Virtual card pass saved to your device",
    });
  };

  if (variant === 'compact') {
    return (
      <div className={`flex gap-1 ${className}`}>
        <Button
          onClick={handleAddToWallet}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-7"
        >
          <Wallet className="h-3 w-3 mr-1" />
          {isLoading ? "Adding..." : "Wallet"}
        </Button>
        <Button
          onClick={handleDownloadPass}
          size="sm"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-7 px-2"
        >
          <Download className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Google Wallet Style Button */}
      <Button
        onClick={handleAddToWallet}
        disabled={isLoading}
        className="w-full bg-black hover:bg-gray-800 text-white border-0 flex items-center justify-center gap-2 py-2"
      >
        <div className="flex items-center gap-2">
          {/* Google Wallet Logo */}
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <Wallet className="h-3 w-3 text-black" />
          </div>
          <span className="font-medium">
            {isLoading ? "Adding to Wallet..." : "Add to Google Wallet"}
          </span>
        </div>
        <ExternalLink className="h-3 w-3" />
      </Button>
      
      {/* Download Alternative */}
      <Button
        onClick={handleDownloadPass}
        variant="outline"
        className="w-full text-xs"
      >
        <Download className="h-3 w-3 mr-2" />
        Download Pass File
      </Button>
      
      {/* Setup Instructions Toggle */}
      <Button
        onClick={() => setShowInstructions(!showInstructions)}
        variant="ghost"
        className="w-full text-xs text-blue-600 hover:text-blue-800"
      >
        <Info className="h-3 w-3 mr-2" />
        {showInstructions ? 'Hide' : 'Show'} Production Setup Steps
      </Button>
      
      {/* Instructions Panel */}
      {showInstructions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-xs space-y-3">
          <div className="font-medium text-blue-900">
            Why you see "Something went wrong":
          </div>
          <p className="text-blue-800">
            Google Wallet requires server-side JWT signing with your private key. 
            The current implementation is client-side only (demo).
          </p>
          
          <div className="font-medium text-blue-900 mt-3">
            Production Setup Required:
          </div>
          <div className="space-y-2 text-blue-800">
            <div>1. ✅ Get Issuer ID: {demoService.getProductionSetupInstructions().steps[0].title}</div>
            <div>2. ❌ Create service account with wallet API access</div>
            <div>3. ❌ Implement server-side JWT signing</div>
            <div>4. ❌ Create wallet classes via API</div>
            <div>5. ❌ Generate signed wallet objects</div>
          </div>
          
          <div className="mt-3 p-2 bg-yellow-100 rounded text-yellow-800">
            💡 Your Issuer ID (3388000000023014969) and website are configured correctly!
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        ✨ Demo feature - Shows Google Wallet integration structure
      </p>
    </div>
  );
}