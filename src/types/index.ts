export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'pro' | 'premium';
  accountBalance: number; // Starting account balance
  currentBalance: number; // Current balance after trades
  createdAt: Date;
}

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number | null;
  quantity: number;
  entryDate: Date;
  exitDate?: Date | null;
  status: 'open' | 'closed';
  pnl?: number | null;
  pnlPercent?: number | null;
  notes?: string | null;
  tags: string[];
  strategy?: string | null;
  balanceAfterTrade?: number | null; // Balance after this trade
  createdAt: Date;
  updatedAt: Date;
}

export interface TradingStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  accountBalance: number; // Starting balance
  currentBalance: number; // Current balance
  totalReturn: number; // Total return percentage
}

export interface AccountBalance {
  id: string;
  userId: string;
  startingBalance: number;
  currentBalance: number;
  totalPnL: number;
  totalReturnPercent: number;
  lastUpdated: Date;
}

export interface Playbook {
  id: string;
  userId: string;
  title: string;
  description: string;
  strategy: string;
  chartImage?: string | null; // Base64 encoded image
  imageMetadata?: {
    originalName: string;
    size: number;
    type: string;
    compressedSize?: number;
  } | null;
  tags: string[];
  marketConditions?: string | null;
  entryRules?: string | null;
  exitRules?: string | null;
  riskManagement?: string | null;
  notes?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}