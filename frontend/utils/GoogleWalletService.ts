export class GoogleWalletService {
  private issuerId: string;
  private classId: string;
//   private websiteUrl: string = 'https://mycards.rizzmo.site';
  private serverUrl: string = 'http://localhost:3001';
  
  constructor() {
    this.issuerId = '3388000000023014969';
    this.classId = `${this.issuerId}.virtual_apt_card_class`;
  }

  // Initialize Google Wallet (called when component mounts)
  async initialize(): Promise<boolean> {
    try {
      // Create wallet class via server
      await this.createWalletClass();
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Wallet:', error);
      return false;
    }
  }

  // Create a wallet class for virtual cards via server
  private async createWalletClass(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/api/wallet/create-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: this.classId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Wallet class created:', result);
    } catch (error) {
      console.error('Error creating wallet class:', error);
      throw error;
    }
  }

  // Create a wallet pass for a specific card via server
  async createWalletPass(cardData: {
    cardId: string;
    owner: string;
    balance: number;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.serverUrl}/api/wallet/create-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.walletUrl;
      } else {
        throw new Error(result.error || 'Failed to create wallet pass');
      }
      
    } catch (error) {
      console.error('Error creating wallet pass:', error);
      throw new Error('Failed to create wallet pass');
    }
  }

  // Get the "Add to Google Wallet" button HTML
  getAddToWalletButton(saveUrl: string): string {
    return `
      <a href="${saveUrl}" target="_blank" style="text-decoration: none;">
        <div style="
          display: inline-flex;
          align-items: center;
          background: #1a73e8;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-family: 'Google Sans', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          transition: box-shadow 0.3s;
        ">
          <img src="https://developers.google.com/wallet/generic/images/add_to_google_wallet_en.svg" 
               alt="Add to Google Wallet" 
               style="height: 20px; margin-right: 8px;">
          Add to Google Wallet
        </div>
      </a>
    `;
  }
}