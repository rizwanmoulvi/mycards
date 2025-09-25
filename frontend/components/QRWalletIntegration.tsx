import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { QrCode, Smartphone, Copy } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { GoogleWalletService } from '../services/googleWallet';

interface QRWalletIntegrationProps {
  card: {
    id: number;
    owner: string;
    balance: number;
  };
}

export function QRWalletIntegration({ card }: QRWalletIntegrationProps) {
  const { toast } = useToast();
  const googleWalletService = new GoogleWalletService();
  
  // Generate the Google Wallet URL
  const walletUrl = googleWalletService.generateAddToWalletUrl(card);
  
  // Create a simple QR code using a service (for demo purposes)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletUrl)}`;
  
  const copyWalletUrl = () => {
    navigator.clipboard.writeText(walletUrl);
    toast({
      title: "Copied!",
      description: "Google Wallet URL copied to clipboard",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Mobile Quick Add
        </CardTitle>
        <CardDescription>
          Scan with your phone to add Card #{card.id} to Google Wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for Google Wallet" 
            className="w-48 h-48"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center flex-col gap-2">
                  <div class="w-16 h-16 bg-gray-300 rounded"></div>
                  <p class="text-sm text-gray-500">QR Code Preview</p>
                </div>
              `;
            }}
          />
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Mobile Instructions:</p>
              <p className="text-blue-700">
                1. Open your phone's camera or QR scanner<br/>
                2. Point it at the QR code above<br/>
                3. Tap the notification to add to Google Wallet
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-2">
          <Button 
            onClick={copyWalletUrl}
            variant="outline" 
            className="w-full text-sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Wallet Link
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Or paste the link directly in your mobile browser
          </p>
        </div>
      </CardContent>
    </Card>
  );
}