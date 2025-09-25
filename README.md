# My Cards

### Programmable Virtual Crypto Cards on Aptos

**My Cards** is building a smarter way to interact with crypto.  

Today, wallets/accounts are monolithic — they are mainly used for:  
1. Sending funds  
2. Receiving funds  
3. Signing transactions  

But this approach has **limitations**:  
- Assets are stored in one large account, making them more exposed to risks.  
- No way to control spending behavior or add programmable rules.  
- No personalized management for different use cases (subscriptions, limits, budgets).  

---

## 🌟 What My Cards Solves

**My Cards** introduces a platform where users can create **virtual crypto cards (accounts)** with predefined **rules, instructions, and permissions** that decide how they behave and interact.  

### ✅ Features:
- Create unlimited cards for just **0.1 APT each**.  
- Store assets safely in separate cards.  
- Define rules like:  
  - Maximum balance allowed.  
  - Fixed amount of tokens per transaction.  
  - Daily transaction limits.  
  - Subscription-style recurring payments.  
- Deposit, transfer, and withdraw funds as needed.  
- See all cards in one **dashboard with analytics** to make better financial decisions.  
- Export cards to **Google Wallet** and use them for transactions by tapping your device at terminals.  

💡 **Next version:** AI-powered natural language rules — define card behavior simply by describing it in plain English.

---

## 🔧 How It Works

1. **Connect wallet** → user connects with Petra (or compatible Aptos wallet).  
2. **Create a card** → define rules and deploy a card account on-chain.  
3. **Fund the card** → deposit APT or USDC and start using it.  
4. **Transact with rules** → send, withdraw, or transfer based on the card’s permissions.  
5. **Track & manage** → view all cards and activity via the analytics dashboard.  
6. **Add to Google Wallet** → copy the card link, add to Wallet, and tap to transact.  

---

## 🏗 Technical Architecture

- **Smart Contract (Move)** deployed on **Aptos testnet**  
  - Handles card creation, deposits, withdrawals, and transfers.  
- **Frontend (React + Vite + TailwindCSS)**  
  - Integrated with the smart contract.  
  - Uses **Petra Wallet** for signing and actions.  
- **Google Wallet Integration**  
  - Cards can be added and used directly via Google Wallet’s API.  

---

## 🔗 Links

- 🌐 **Website**: [https://mycards.rizzmo.site/](https://mycards.rizzmo.site/)  
- 📜 **Module**: [CardManager on Aptos Explorer](https://explorer.aptoslabs.com/account/0xa4ad32f3a9215c61bc69b26b859b9de9b997b3fd5bbd15fc735aa47e0d91aa87/modules/view/CardManager/get_balance?network=testnet)  
- 🎥 **Demo Video**: [YouTube Link](https://youtu.be/Qfddzt26-_E)  
- 📑 **Pitch Deck**: [Canva Presentation](https://www.canva.com/design/DAGz9fn9ahI/bTrN1np6l5zF_8TUvSGIwg/view?utm_content=DAGz9fn9ahI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h006b46fc56)  

---

## 🧪 Google Wallet Testing

If you’d like to test adding a card to Google Wallet, please email:  
📧 **zeusprime1610@gmail.com**  

I’ll add you as a tester so you can use the feature.

---

## 🚀 Future Roadmap

- AI-powered natural language rule generation.  
- Advanced analytics & budgeting features.  
- Merchant integrations & recurring payment APIs.  
- Multi-token support (beyond APT/USDC).  

---
