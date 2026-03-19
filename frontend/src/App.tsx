import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Wallet, Shield, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './components/UI/Button';
import { Input } from './components/UI/Input';
import { Card } from './components/UI/Card';
import stellarService from './services/stellar';
import { DeploymentStatus } from './types';
import type { WalletState, TokenDeployParams } from './types';

const App = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isInstalled: true,
  });

  const [status, setStatus] = useState<DeploymentStatus>(DeploymentStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [params, setParams] = useState<TokenDeployParams>({
    name: '',
    symbol: '',
    decimals: 7,
    initialSupply: '1000000',
  });

  // Check wallet on mount
  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    const { isConnected } = await stellarService.checkWallet();
    if (isConnected) {
      const address = await stellarService.getPublicKey();
      setWallet({ address, isConnected: true, isInstalled: true });
    }
  };

  const connectWallet = async () => {
    try {
      setStatus(DeploymentStatus.CONNECTING);
      const address = await stellarService.getPublicKey();
      setWallet({ address, isConnected: true, isInstalled: true });
      setStatus(DeploymentStatus.IDLE);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setStatus(DeploymentStatus.ERROR);
    }
  };

  const handleDeploy = async () => {
    if (!wallet.address) return;

    try {
      setStatus(DeploymentStatus.DEPLOYING);
      setError(null);

      // In a real app, you'd fetch this from env or config
      const FACTORY_ID = "CA...FACTORY_CONTRACT_ID"; 
      
      const result = await stellarService.deployToken(FACTORY_ID, {
        ...params,
        creator: wallet.address,
      });

      setTxHash(result.hash);
      setStatus(DeploymentStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Deployment failed. Please check your balance and try again.');
      setStatus(DeploymentStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-stellar-dark">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stellar-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-stellar-purple rounded-lg">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Rocket <span className="text-stellar-purple">Jump</span></span>
        </div>

        <Button 
          variant={wallet.isConnected ? "outline" : "primary"}
          onClick={wallet.isConnected ? undefined : connectWallet}
          className="flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {wallet.isConnected ? (
            <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
          ) : "Connect Wallet"}
        </Button>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24">
        <header className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Deploy on Stellar <br />
            <span className="gradient-text">In Seconds.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            The easiest way to lunch your token on Stellar. 
            No coding required, optimized for Nigeria & emerging markets.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="md:col-span-12">
            <Card className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Token Name" 
                    placeholder="e.g. My Awesome Token" 
                    value={params.name}
                    onChange={(e) => setParams({ ...params, name: e.target.value })}
                  />
                  <Input 
                    label="Symbol" 
                    placeholder="e.g. MAT" 
                    value={params.symbol}
                    onChange={(e) => setParams({ ...params, symbol: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Initial Supply" 
                    type="number"
                    value={params.initialSupply}
                    onChange={(e) => setParams({ ...params, initialSupply: e.target.value })}
                  />
                  <Input 
                    label="Decimals" 
                    type="number"
                    value={params.decimals}
                    onChange={(e) => setParams({ ...params, decimals: parseInt(e.target.value) })}
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Deployment Fee</span>
                    <span className="font-mono">1 XLM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Network Fee (~0.0001)</span>
                    <span className="font-mono text-stellar-purple">FREE</span>
                  </div>
                </div>

                <Button 
                  className="w-full text-lg py-4"
                  onClick={handleDeploy}
                  isLoading={status === DeploymentStatus.DEPLOYING}
                  disabled={!wallet.isConnected}
                >
                  {wallet.isConnected ? "Launch Token" : "Connect Wallet to Launch"}
                </Button>

                <AnimatePresence>
                  {status === DeploymentStatus.SUCCESS && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-green-500">Deployment Succesful!</p>
                        <p className="text-sm text-green-500/80">Your token is now live on Stellar Testnet.</p>
                        {txHash && (
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} 
                            target="_blank" 
                            className="text-xs underline hover:text-green-400"
                          >
                            View Transaction
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {status === DeploymentStatus.ERROR && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-red-500">Something went wrong</p>
                        <p className="text-sm text-red-500/80">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 glass rounded-2xl space-y-4">
            <div className="w-12 h-12 bg-stellar-purple/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-stellar-purple" />
            </div>
            <h4 className="text-xl font-bold">Secure</h4>
            <p className="text-white/60">Fully non-custodial. Your keys, your tokens. Built on Stellar's robust infra.</p>
          </div>
          <div className="p-8 glass rounded-2xl space-y-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-pink-500" />
            </div>
            <h4 className="text-xl font-bold">Fast</h4>
            <p className="text-white/60">Deployed in seconds. No complex coding or smart contract knowledge needed.</p>
          </div>
          <div className="p-8 glass rounded-2xl space-y-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="text-xl font-bold">Scale</h4>
            <p className="text-white/60">Ready for global distribution. Reach millions of users on the Stellar network.</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-12 text-center text-white/40 border-t border-white/5">
        <p>&copy; 2026 Rocket Jump. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
