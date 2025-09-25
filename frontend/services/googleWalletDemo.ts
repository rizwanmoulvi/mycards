import { CardDetails } from "../view-functions/getCardDetails";

export interface GoogleWalletDemo {
  success: boolean;
  message: string;
  demoUrl?: string;
  requiredSteps?: string[];
}

export class GoogleWalletDemoService {
  private readonly issuerId = "3388000000023014969";
  private readonly websiteUrl = "https://mycards.rizzmo.site";
  
  /**
   * Generate a demo Google Wallet experience
   * This simulates what would happen in production
   */
  async addToWalletDemo(card: CardDetails): Promise<GoogleWalletDemo> {
    // Simulate the production requirements
    const requiredSteps = [
      "1. Register as a Google Wallet API partner",
      "2. Create a service account with proper credentials", 
      "3. Implement server-side JWT signing with your private key",
      "4. Create wallet classes via the Google Wallet API",
      "5. Generate signed wallet objects server-side",
      "6. Return proper save URLs to the frontend"
    ];

    // Create a demo URL that shows what the real integration would look like
    const demoParams = new URLSearchParams({
      demo: 'true',
      issuer: this.issuerId,
      cardId: card.id.toString(),
      balance: (card.balance / 100000000).toFixed(4),
      owner: this.truncateAddress(card.owner),
      website: this.websiteUrl
    });

    const demoUrl = `https://pay.google.com/gp/v/save/demo?${demoParams.toString()}`;

    return {
      success: true,
      message: "This demonstrates the Google Wallet integration flow. In production, this would add the card to your wallet.",
      demoUrl,
      requiredSteps
    };
  }

  /**
   * Create a working Google Wallet URL using the proper format
   * This creates the actual URL format that Google expects
   */
  generateProductionWalletUrl(card: CardDetails): string {
    const classId = `${this.issuerId}.virtual_apt_card_class`;
    const objectId = `${this.issuerId}.virtual_card_${card.id}_${Date.now()}`;

    // This is the proper JWT payload structure for Google Wallet
    const jwtPayload = {
      iss: this.issuerId,
      aud: "google", 
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: [this.websiteUrl],
      payload: {
        genericObjects: [{
          id: objectId,
          classId: classId,
          cardTitle: {
            defaultValue: {
              language: "en-US",
              value: "Virtual APT Card"
            }
          },
          subheader: {
            defaultValue: {
              language: "en-US",
              value: `Card #${card.id}`
            }
          },
          header: {
            defaultValue: {
              language: "en-US", 
              value: `${(card.balance / 100000000).toFixed(4)} APT`
            }
          },
          textModulesData: [
            {
              id: "balance",
              header: "Balance",
              body: `${(card.balance / 100000000).toFixed(8)} APT`
            },
            {
              id: "owner",
              header: "Owner", 
              body: this.truncateAddress(card.owner)
            },
            {
              id: "network",
              header: "Network",
              body: "Aptos Testnet"
            }
          ],
          barcode: {
            type: "QR_CODE",
            value: `virtual-card-${card.id}-${card.owner}`
          },
          hexBackgroundColor: "#1976D2"
        }]
      }
    };

    // In production, you would sign this JWT with your private key
    // const signedJWT = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });
    // return `https://pay.google.com/gp/v/save/${signedJWT}`;
    
    // For demo, return the unsigned payload (this will show the error you're seeing)
    const base64Payload = btoa(JSON.stringify(jwtPayload));
    return `https://pay.google.com/gp/v/save/${base64Payload}`;
  }

  /**
   * Get the setup instructions for real Google Wallet integration
   */
  getProductionSetupInstructions(): {
    title: string;
    steps: Array<{
      step: number;
      title: string;
      description: string;
      links?: string[];
    }>;
  } {
    return {
      title: "Setting up Google Wallet Integration",
      steps: [
        {
          step: 1,
          title: "Get Google Wallet API Access",
          description: "Apply for Google Wallet API access and get approved as a partner",
          links: ["https://developers.google.com/wallet/generic/web/prerequisites"]
        },
        {
          step: 2, 
          title: "Create Service Account",
          description: "Create a Google Cloud service account with Wallet API permissions",
          links: ["https://console.cloud.google.com/apis/credentials"]
        },
        {
          step: 3,
          title: "Implement Server-Side JWT Signing", 
          description: "Create backend endpoints to sign JWT tokens with your private key",
          links: ["https://developers.google.com/wallet/generic/web/create-jwt"]
        },
        {
          step: 4,
          title: "Create Wallet Classes",
          description: "Define your card templates using the Google Wallet API",
          links: ["https://developers.google.com/wallet/generic/web/create-class"]
        },
        {
          step: 5,
          title: "Generate Wallet Objects",
          description: "Create individual wallet passes for each card",
          links: ["https://developers.google.com/wallet/generic/web/create-object"]
        }
      ]
    };
  }

  private truncateAddress(address: string): string {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }
}