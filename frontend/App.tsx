import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import {  CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";


import { CardManager } from "@/components/CardManager";

function App() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <div className="w-full max-w-7xl space-y-6">
            <CardManager />
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Built on Aptos Blockchain
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent mb-6">
                Programmable Virtual
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Crypto Cards
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Create smart crypto accounts with custom rules and restrictions. Set spending limits, 
                whitelist addresses, and control transactions using natural language commands powered by AI.
              </p>
              
              <CardHeader className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg max-w-md mx-auto">
                <CardTitle className="text-emerald-600">🚀 Connect your wallet to get started</CardTitle>
              </CardHeader>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group p-6 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                  💳
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Card Creation</h3>
                <p className="text-gray-600">
                  Create virtual crypto cards with programmable rules. Set maximum balances, 
                  transaction limits, and custom spending restrictions.
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                  🤖
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Rules</h3>
                <p className="text-gray-600">
                  Define card rules in natural language. Say "limit to $100 per day" or 
                  "only allow payments to my friends" and AI sets the rules automatically.
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Track your cards with detailed analytics. Monitor total balances, 
                  transaction activity, and spending patterns across all your cards.
                </p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Perfect For</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    👨‍💼
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Business Expenses</h4>
                  <p className="text-sm text-gray-600">Corporate cards with spending limits and category restrictions</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    👨‍👩‍👧‍👦
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Family Allowances</h4>
                  <p className="text-sm text-gray-600">Safe cards for kids with parental controls and limits</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    🎯
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Project Budgets</h4>
                  <p className="text-sm text-gray-600">Dedicated cards for specific projects with automatic tracking</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    🛡️
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Security First</h4>
                  <p className="text-sm text-gray-600">Whitelist trusted addresses and prevent unauthorized spending</p>
                </div>
              </div>
            </div>

            {/* Technology */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Built with Cutting-Edge Technology</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full text-sm font-medium">
                  Aptos Blockchain
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium">
                  Move Smart Contracts
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium">
                  AI Rule Engine
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium">
                  Google Wallet Integration
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
