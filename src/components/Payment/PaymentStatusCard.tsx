import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { Payment } from '../../types';
import { format } from 'date-fns';

interface PaymentStatusCardProps {
  payment: Payment;
  onViewDetails: (payment: Payment) => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ payment, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (payment.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'PKR' ? '₨' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(payment.amount, payment.currency)} • {payment.paymentMethod === 'pakistan' ? 'Pakistan' : 'International'}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
          <span className="font-mono text-gray-900 dark:text-white">{payment.transactionId}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
          <span className="text-gray-900 dark:text-white">
            {format(payment.submittedAt, 'MMM dd, yyyy HH:mm')}
          </span>
        </div>

        {payment.reviewedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Reviewed:</span>
            <span className="text-gray-900 dark:text-white">
              {format(payment.reviewedAt, 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        )}
      </div>

      {payment.adminNotes && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Admin Notes:</strong> {payment.adminNotes}
          </p>
        </div>
      )}

      <button
        onClick={() => onViewDetails(payment)}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
      >
        <Eye className="h-4 w-4" />
        <span>View Details</span>
      </button>
    </div>
  );
};

export default PaymentStatusCard;