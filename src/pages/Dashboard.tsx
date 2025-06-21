import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award, Calendar, Filter, Eye, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrades } from '../hooks/useTrades';
import { useAccountBalance } from '../hooks/useAccountBalance';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
import AccountBalanceCard from '../components/Dashboard/AccountBalanceCard';
import AddTradeModal from '../components/Dashboard/AddTradeModal';
import InlineStartingBalanceSetup from '../components/Dashboard/InlineStartingBalanceSetup';
import DetailedStatsGrid from '../components/Dashboard/DetailedStatsGrid';
import AdvancedPerformanceChart from '../components/Dashboard/AdvancedPerformanceChart';
import PlaybookSidebar from '../components/Dashboard/PlaybookSidebar';
import ProfessionalDashboard from '../components/Dashboard/ProfessionalDashboard';
import ErrorBoundary from '../components/ErrorBoundary';
import { usePlaybooks } from '../hooks/usePlaybooks';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trades, stats, loading, error, addTrade, updateTrade, deleteTrade } = useTrades(user?.id);
  const { accountBalance, loading: balanceLoading, updateStartingBalance } = useAccountBalance(user?.id);
  const { playbooks } = usePlaybooks(user?.id);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
        </div>
      </div>
    );
  }

  // Show loading state while checking account balance
  if (balanceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading your dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your trading environment
          </p>
        </div>
      </div>
    );
  }

  // CRITICAL: Check if user needs to set starting balance
  const needsStartingBalance = !accountBalance || accountBalance.startingBalance === 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* CRITICAL: Inline Starting Balance Setup - Show if needed */}
        {needsStartingBalance ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InlineStartingBalanceSetup
              onSubmit={updateStartingBalance}
              defaultValue={10000}
            />
          </div>
        ) : (
          <ProfessionalDashboard
            user={user}
            trades={trades}
            stats={stats}
            accountBalance={accountBalance}
            playbooks={playbooks}
            loading={loading}
            error={error}
            onAddTrade={() => setShowAddTradeModal(true)}
            onUpdateTrade={updateTrade}
            onDeleteTrade={deleteTrade}
            onUpdateBalance={updateStartingBalance}
          />
        )}

        {/* Add Trade Modal */}
        {showAddTradeModal && (
          <AddTradeModal
            onClose={() => setShowAddTradeModal(false)}
            onSubmit={addTrade}
            userId={user.id}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;