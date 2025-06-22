import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter, 
  Search, 
  Download,
  CreditCard,
  MapPin,
  Globe,
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Payment } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterMethod, setFilterMethod] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const paymentsQuery = query(
      collection(db, 'payments'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentsData: Payment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        paymentsData.push({
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          reviewedAt: data.reviewedAt?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Payment);
      });
      setPayments(paymentsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    const matchesMethod = !filterMethod || payment.paymentMethod === filterMethod;
    const matchesSearch = !searchTerm || 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const handleApprovePayment = async (payment: Payment) => {
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: 'admin', // In real app, use actual admin user
        adminNotes: adminNotes || '',
        updatedAt: serverTimestamp()
      });

      // Update user's plan in users collection
      await updateDoc(doc(db, 'users', payment.userId), {
        plan: payment.plan,
        updatedAt: serverTimestamp()
      });

      toast.success('Payment approved successfully!');
      setSelectedPayment(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (payment: Payment) => {
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: 'admin', // In real app, use actual admin user
        adminNotes: adminNotes,
        updatedAt: serverTimestamp()
      });

      toast.success('Payment rejected');
      setSelectedPayment(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'PKR' ? '₨' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'User', 'Email', 'Plan', 'Amount', 'Currency', 'Method', 'Transaction ID', 'Status', 'Reviewed At', 'Admin Notes'].join(','),
      ...filteredPayments.map(payment => [
        format(payment.submittedAt, 'yyyy-MM-dd HH:mm'),
        payment.userName,
        payment.userEmail,
        payment.plan,
        payment.amount,
        payment.currency,
        payment.paymentMethod,
        payment.transactionId,
        payment.status,
        payment.reviewedAt ? format(payment.reviewedAt, 'yyyy-MM-dd HH:mm') : '',
        payment.adminNotes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Payments exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Review and approve user payments</p>
        </div>
        <button
          onClick={exportPayments}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-lg">
              <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 md:p-3 rounded-lg">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {payments.filter(p => p.status === 'approved').length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 md:p-3 rounded-lg">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {payments.filter(p => p.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 md:p-3 rounded-lg">
              <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Methods</option>
            <option value="pakistan">Pakistan</option>
            <option value="international">International</option>
          </select>
        </div>
      </div>

      {/* Payments - Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus || filterMethod 
                ? 'Try adjusting your filters to see more results' 
                : 'No payments have been submitted yet'}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {payment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.userName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{payment.userEmail}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Method:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {payment.paymentMethod === 'pakistan' ? 'Pakistan' : 'International'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {format(payment.submittedAt, 'MMM dd')}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                  ID: {payment.transactionId}
                </div>
                <button
                  onClick={() => {
                    setSelectedPayment(payment);
                    setAdminNotes(payment.adminNotes || '');
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs"
                >
                  <Eye className="h-3 w-3" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payments Table - Desktop View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus || filterMethod 
                ? 'Try adjusting your filters to see more results' 
                : 'No payments have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(payment.submittedAt, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {payment.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.userName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{payment.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.plan === 'premium' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}>
                        {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {payment.paymentMethod === 'pakistan' ? (
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                        ) : (
                          <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                        )}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {payment.paymentMethod === 'pakistan' ? 'Pakistan' : 'International'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setAdminNotes(payment.adminNotes || '');
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusIcon(selectedPayment.status)}
                  <span className="ml-1">{selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedPayment.userId}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPayment.plan.charAt(0).toUpperCase() + selectedPayment.plan.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedPayment.paymentMethod === 'pakistan' ? 'Pakistan (NayaPay)' : 'International (Binance)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedPayment.transactionId}</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {selectedPayment.paymentMethod === 'pakistan' ? (
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Details</h3>
                </div>
                
                {selectedPayment.paymentMethod === 'pakistan' ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Title</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPayment.accountDetails.accountTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Name</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {selectedPayment.accountDetails.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Number</p>
                      <p className="font-mono font-medium text-gray-900 dark:text-white">
                        {selectedPayment.accountDetails.accountNumber}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Binance ID</p>
                      <p className="font-mono font-medium text-gray-900 dark:text-white">
                        {selectedPayment.accountDetails.binanceId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedPayment.accountDetails.binanceName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dates</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Submitted At</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(selectedPayment.submittedAt, 'PPP p')}
                    </p>
                  </div>
                  {selectedPayment.reviewedAt && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed At</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {format(selectedPayment.reviewedAt, 'PPP p')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedPayment.status === 'pending' ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Notes</h3>
                  </div>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add notes about this payment (optional for approval, required for rejection)"
                  ></textarea>
                </div>
              ) : selectedPayment.adminNotes ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Notes</h3>
                  </div>
                  <p className="text-gray-900 dark:text-white">{selectedPayment.adminNotes}</p>
                </div>
              ) : null}

              {/* Admin Actions */}
              {selectedPayment.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleApprovePayment(selectedPayment)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Approve Payment
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedPayment)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <X className="h-5 w-5 mr-2" />
                        Reject Payment
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Close Button for Approved/Rejected Payments */}
              {selectedPayment.status !== 'pending' && (
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;