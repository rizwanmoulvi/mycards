// Google Wallet Integration Service
import { CardDetails } from "../view-functions/getCardDetails";

export interface GoogleWalletCard {
  id: string;
  classId: string;
  genericObjects: Array<{
    id: string;
    classId: string;
    logo: {
      sourceUri: {
        uri: string;
      };
    };
    cardTitle: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
    subheader: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
    header: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
    textModulesData: Array<{
      id: string;
      header: string;
      body: string;
    }>;
    barcode: {
      type: string;
      value: string;
    };
    hexBackgroundColor: string;
    heroImage: {
      sourceUri: {
        uri: string;
      };
    };
  }>;
}

export class GoogleWalletService {
  private readonly issuerId = "3388000000023014969"; // Your real issuer ID
  private readonly classIdSuffix = "virtual_card_class";
  private readonly websiteUrl = "https://mycards.rizzmo.site";
  
  /**
   * Generate a Google Wallet pass URL for a virtual card
   * Note: In production, this should be done server-side with proper JWT signing
   */
  generateAddToWalletUrl(card: CardDetails): string {
    const classId = `${this.issuerId}.${this.classIdSuffix}`;
    const objectId = `${this.issuerId}.virtual_card_${card.id}_${Date.now()}`;
    
    const walletObject = {
      id: objectId,
      classId: classId,
      logo: {
        sourceUri: {
          uri: "https://mycards.rizzmo.site/aptos.png"
        }
      },
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
          value: `${(card.balance / 100000000).toFixed(2)} APT`
        }
      },
      textModulesData: [
        {
          id: "card_id",
          header: "Card ID",
          body: card.id.toString()
        },
        {
          id: "owner",
          header: "Owner",
          body: this.truncateAddress(card.owner)
        },
        {
          id: "balance",
          header: "Balance",
          body: `${(card.balance / 100000000).toFixed(8)} APT`
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
      hexBackgroundColor: "#1976D2",
      heroImage: {
        sourceUri: {
          uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/google-io-hero-demo-only.jpg"
        }
      }
    };

    // Create the class object (this would normally be done server-side)
    // const classObject = {
    //   id: classId,
    //   issuerName: "Virtual APT Cards",
    //   reviewStatus: "UNDER_REVIEW",
    //   logo: {
    //     sourceUri: {
    //       uri: "https://mycards.rizzmo.site/aptos.png"
    //     }
    //   },
    //   hexBackgroundColor: "#1976D2",
    //   origins: [
    //     {
    //       origin: this.websiteUrl
    //     }
    //   ],
    //   classTemplateInfo: {
    //     cardTemplateOverride: {
    //       cardRowTemplateInfos: [
    //         {
    //           twoItems: {
    //             startItem: {
    //               firstValue: {
    //                 fields: [
    //                   {
    //                     fieldPath: "object.textModulesData['card_id']"
    //                   }
    //                 ]
    //               }
    //             },
    //             endItem: {
    //               firstValue: {
    //                 fields: [
    //                   {
    //                     fieldPath: "object.textModulesData['balance']"
    //                   }
    //                 ]
    //               }
    //             }
    //           }
    //         },
    //         {
    //           oneItem: {
    //             item: {
    //               firstValue: {
    //                 fields: [
    //                   {
    //                     fieldPath: "object.textModulesData['owner']"
    //                   }
    //                 ]
    //               }
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // };

    // For production, you would need to:
    // 1. Create the class on Google Wallet API server-side
    // 2. Generate a signed JWT token server-side  
    // 3. Return the proper save URL
    
    // For demo purposes, create a simplified payload
    const payload = {
      iss: this.issuerId,
      aud: "google",
      typ: "savetowallet",
      origins: [this.websiteUrl],
      payload: {
        genericObjects: [walletObject]
      }
    };

    // In production, this would be a signed JWT. For demo, we'll use base64
    const base64Payload = btoa(JSON.stringify(payload));
    return `https://pay.google.com/gp/v/save/${base64Payload}`;
  }

  /**
   * Truncate long addresses for display
   */
  private truncateAddress(address: string): string {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }

  /**
   * Check if Google Wallet is supported in the current browser
   */
  isGoogleWalletSupported(): boolean {
    // Google Wallet is supported on Android Chrome and some other browsers
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isChrome = userAgent.includes('chrome');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    
    return (isAndroid && isChrome) || isIOS;
  }

  /**
   * Get user-friendly guidance for Google Wallet
   */
  getWalletGuidance(): { 
    supported: boolean; 
    message: string; 
    recommendation?: string;
  } {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    const isChrome = userAgent.includes('chrome');
    const isDesktop = !isAndroid && !isIOS;

    if (isAndroid && isChrome) {
      return {
        supported: true,
        message: "Perfect! Google Wallet is fully supported on your Android device.",
        recommendation: "The card will be added directly to your Google Wallet app."
      };
    }

    if (isIOS) {
      return {
        supported: true,
        message: "Google Wallet works on iOS devices too!",
        recommendation: "You'll be redirected to add the card to your wallet."
      };
    }

    if (isDesktop) {
      return {
        supported: false,
        message: "Google Wallet works best on mobile devices.",
        recommendation: "Try this feature on your phone for the best experience, or download the pass file."
      };
    }

    return {
      supported: false,
      message: "For the best experience, use Chrome on Android or Safari on iOS.",
      recommendation: "You can still download the pass file to import manually."
    };
  }

  /**
   * Open Google Wallet add dialog
   */
  async addToWallet(card: CardDetails): Promise<void> {
    const walletUrl = this.generateAddToWalletUrl(card);
    
    try {
      // Try to open in the same tab for mobile
      if (this.isGoogleWalletSupported()) {
        window.location.href = walletUrl;
      } else {
        // For desktop or unsupported browsers, open in new tab
        window.open(walletUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error adding card to Google Wallet:', error);
      throw new Error('Failed to add card to Google Wallet');
    }
  }

  /**
   * Generate a downloadable pass file (PKPass format simulation)
   */
  generateDownloadablePass(card: CardDetails): string {
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.virtualcards.apt",
      serialNumber: `VC-${card.id}`,
      teamIdentifier: "VIRTUAL",
      organizationName: "Virtual APT Cards",
      description: `Virtual APT Card #${card.id}`,
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(25, 118, 210)",
      generic: {
        primaryFields: [
          {
            key: "balance",
            label: "Balance",
            value: `${(card.balance / 100000000).toFixed(2)} APT`
          }
        ],
        secondaryFields: [
          {
            key: "cardId",
            label: "Card ID",
            value: card.id.toString()
          },
          {
            key: "network",
            label: "Network",
            value: "Aptos Testnet"
          }
        ],
        auxiliaryFields: [
          {
            key: "owner",
            label: "Owner",
            value: this.truncateAddress(card.owner)
          }
        ]
      },
      barcode: {
        message: `virtual-card-${card.id}-${card.owner}`,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1"
      }
    };

    const jsonString = JSON.stringify(passData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }
}