import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StatsCards from '../components/Dashboard/StatsCards';
import TradeTable from '../components/Dashboard/TradeTable';
// import { useResponsive } from '../hooks/useResponsive'; // Is line ko hata diya gaya hai

const Dashboard = () => {
  // const { isDesktop } = useResponsive(); // Is line ko bhi hata diya gaya hai

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      <StatsCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PerformanceChart />
        </div>
        <div className="xl:col-span-1">
          {/* Any other component can go here */}
        </div>
      </div>

      <div>
        <TradeTable />
      </div>
    </div>
  );
};

export default Dashboard;
