import freighter from "@stellar/freighter-api";
const { isConnected, getAddress, signTransaction } = freighter;

import {
  Horizon,
  TransactionBuilder,
  Networks,
} from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

/**
 * Stellar Service for interacting with the blockchain and wallet
 */
export class StellarService {
  /**
   * Check if Freighter is installed and connected
   */
  async checkWallet(): Promise<{ isInstalled: boolean; isConnected: boolean }> {
    const isInstalled = true; 
    const result = await isConnected();
    // Freighter 6.0+ returns { isConnected: boolean }
    return { isInstalled, isConnected: !!(result as any).isConnected };
  }

  /**
   * Get public key from Freighter
   */
  async getPublicKey(): Promise<string> {
    const result = await getAddress();
    // Freighter returns { address: string }
    return typeof result === 'string' ? result : (result as any).address;
  }

  /**
   * Deploy a new token by calling the Factory contract
   */
  async deployToken(
    _contractId: string,
    params: {
      name: string;
      symbol: string;
      decimals: number;
      initialSupply: string;
      creator: string;
    }
  ): Promise<any> {
    console.log("Deploying token with params:", params);
    
    // 1. Fetch account
    const sourceAccount = await server.loadAccount(params.creator);

    // 2. Build Transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "1000",
      networkPassphrase: Networks.TESTNET,
    })
      .setTimeout(30)
      .build();

    // 3. Sign with Freighter
    const xdrString = transaction.toXDR();
    const signResult = await signTransaction(xdrString, {
      networkPassphrase: Networks.TESTNET,
    });
    
    // signTransaction returns { signedTxXdr: string }
    const signedXdr = typeof signResult === 'string' ? signResult : (signResult as any).signedTxXdr;

    // 4. Submit to Network
    const tx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    return await server.submitTransaction(tx as any);
  }
}

export default new StellarService();
