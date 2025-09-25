import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { GoogleWalletButton } from "./GoogleWalletButton";
import { QRWalletIntegration } from "./QRWalletIntegration";
import { Smartphone, Wallet, Star, Shield, Zap } from "lucide-react";

export function GoogleWalletShowcase() {
  // Demo card for showcase
  const demoCard = {
    id: 999,
    owner: "0x1234...abcd",
    balance: 500000000 // 5 APT
  };

  return (
    <Card className="w-full border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-600" />
              Google Wallet Integration
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Demo Feature
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              Experience the future of digital cards! Add your virtual APT cards to Google Wallet for easy access.
            </CardDescription>
          </div>
          <div className="text-right">
            <Smartphone className="h-16 w-16 text-blue-600 opacity-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-sm">Instant Access</p>
              <p className="text-xs text-gray-600">Quick access from your phone</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Shield className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Secure Storage</p>
              <p className="text-xs text-gray-600">Protected by Google</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Zap className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium text-sm">Smart Integration</p>
              <p className="text-xs text-gray-600">Works across devices</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Try the Demo
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the button below to see how your virtual cards would appear in Google Wallet:
              </p>
              <GoogleWalletButton card={demoCard} variant="full" />
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-6">
            <QRWalletIntegration card={demoCard} />
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3">How it works:</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Click "Add to Google Wallet" on any of your virtual cards</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Your card details are securely formatted for Google Wallet</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Access your cards anytime from your phone's wallet app</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 italic">
          💡 This is a demonstration of blockchain-to-wallet integration. In a production environment, 
          these cards could potentially integrate with payment systems and loyalty programs.
        </div>
      </CardContent>
    </Card>
  );
}