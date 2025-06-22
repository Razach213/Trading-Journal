import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Globe, Copy, Check, CreditCard, Building, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  onClose: () => void;
  selectedPlan: 'pro' | 'premium';
  planPrice: number;
}

interface PaymentFormData {
  location: 'pakistan' | 'international';
  transactionId: string;
  confirmTerms: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, selectedPlan, planPrice }) => {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<'pakistan' | 'international' | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>();
  
  const transactionId = watch('transactionId');

  // Pakistan account details
  const pakistanAccount = {
    accountTitle: 'Ali Raza',
    accountName: 'NayaPay',
    accountNumber: '0302-9335127'
  };

  // International Binance details
  const binanceAccount = {
    binanceId: '585314519',
    name: 'Thealiraza2'
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!user || !selectedLocation) return;

    setIsSubmitting(true);
    try {
      const paymentData = {
        userId: user.id,
        userEmail: user.email,
        userName: user.displayName,
        plan: selectedPlan,
        amount: planPrice,
        currency: selectedLocation === 'pakistan' ? 'PKR' : 'USD',
        paymentMethod: selectedLocation,
        accountDetails: selectedLocation === 'pakistan' ? {
          accountTitle: pakistanAccount.accountTitle,
          accountName: pakistanAccount.accountName,
          accountNumber: pakistanAccount.accountNumber
        } : {
          binanceId: binanceAccount.binanceId,
          binanceName: binanceAccount.name
        },
        transactionId: data.transactionId.trim(),
        status: 'pending',
        submittedAt: new Date(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'payments'), paymentData);
      
      toast.success('Payment submitted successfully! We will review it within 24 hours.');
      onClose();
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment for {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Amount: {selectedLocation === 'pakistan' ? '₨' : '$'}{planPrice}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                Choose Your Location
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                We offer different payment methods based on your location for your convenience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pakistan Option */}
              <div className="relative">
                <button
                  onClick={() => setSelectedLocation(selectedLocation === 'pakistan' ? null : 'pakistan')}
                  className={`w-full group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 ${
                    selectedLocation === 'pakistan' 
                      ? 'border-green-500 dark:border-green-500' 
                      : 'border-green-200 dark:border-green-800'
                  } rounded-xl p-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200`}
                >
                  <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pakistan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Pay using local Pakistani payment methods
                    </p>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      NayaPay • Bank Transfer
                    </div>
                  </div>
                </button>

                {/* Pakistan Payment Details - Accordion Style */}
                <div 
                  className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedLocation === 'pakistan' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 p-6 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Pakistan Payment Details
                    </h4>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        Please transfer <strong>₨{planPrice}</strong> to the following account:
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Account Title:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">{pakistanAccount.accountTitle}</span>
                              <button
                                onClick={() => copyToClipboard(pakistanAccount.accountTitle, 'title')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                {copiedField === 'title' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900 dark:text-white">{pakistanAccount.accountName}</span>
                              <button
                                onClick={() => copyToClipboard(pakistanAccount.accountName, 'name')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                {copiedField === 'name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{pakistanAccount.accountNumber}</span>
                              <button
                                onClick={() => copyToClipboard(pakistanAccount.accountNumber, 'number')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              >
                                {copiedField === 'number' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Transaction ID Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Transaction ID / Reference Number *
                          </label>
                          <input
                            {...register('transactionId', { 
                              required: 'Transaction ID is required',
                              minLength: { value: 3, message: 'Transaction ID must be at least 3 characters' }
                            })}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your transaction ID or reference number"
                          />
                          {errors.transactionId && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.transactionId.message}</p>
                          )}
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            {...register('confirmTerms', { required: 'You must agree to the terms' })}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            I confirm that I have made the payment and the transaction ID provided is accurate.
                          </label>
                        </div>
                        {errors.confirmTerms && (
                          <p className="text-red-600 dark:text-red-400 text-sm">{errors.confirmTerms.message}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || !transactionId}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Submitting Payment...
                            </>
                          ) : (
                            'Submit Payment for Review'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Option */}
              <div className="relative">
                <button
                  onClick={() => setSelectedLocation(selectedLocation === 'international' ? null : 'international')}
                  className={`w-full group relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 ${
                    selectedLocation === 'international' 
                      ? 'border-blue-500 dark:border-blue-500' 
                      : 'border-blue-200 dark:border-blue-800'
                  } rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200`}
                >
                  <div className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">International</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Pay using international payment methods
                    </p>
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                      Binance • Cryptocurrency
                    </div>
                  </div>
                </button>

                {/* International Payment Details - Accordion Style */}
                <div 
                  className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    selectedLocation === 'international' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      International Payment Details
                    </h4>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        Please send <strong>${planPrice} USD</strong> to the following Binance account:
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">Binance</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Binance ID:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">{binanceAccount.binanceId}</span>
                              <button
                                onClick={() => copyToClipboard(binanceAccount.binanceId, 'binanceId')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                              >
                                {copiedField === 'binanceId' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">{binanceAccount.name}</span>
                              <button
                                onClick={() => copyToClipboard(binanceAccount.name, 'binanceName')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                {copiedField === 'binanceName' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Transaction ID Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Transaction ID / Reference Number *
                          </label>
                          <input
                            {...register('transactionId', { 
                              required: 'Transaction ID is required',
                              minLength: { value: 3, message: 'Transaction ID must be at least 3 characters' }
                            })}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your transaction ID or reference number"
                          />
                          {errors.transactionId && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.transactionId.message}</p>
                          )}
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            {...register('confirmTerms', { required: 'You must agree to the terms' })}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <label className="text-sm text-gray-700 dark:text-gray-300">
                            I confirm that I have made the payment and the transaction ID provided is accurate.
                          </label>
                        </div>
                        {errors.confirmTerms && (
                          <p className="text-red-600 dark:text-red-400 text-sm">{errors.confirmTerms.message}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || !transactionId}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Submitting Payment...
                            </>
                          ) : (
                            'Submit Payment for Review'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    After making the payment, please enter your Transaction ID. We will review and activate your account within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;