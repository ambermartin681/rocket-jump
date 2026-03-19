export const DeploymentStatus = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  DEPLOYING: 'DEPLOYING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export type DeploymentStatus = typeof DeploymentStatus[keyof typeof DeploymentStatus];

export interface TokenDeployParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
}

export interface DeploymentResult {
  success: boolean;
  tokenAddress?: string;
  transactionHash?: string;
  error?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isInstalled: boolean;
}
