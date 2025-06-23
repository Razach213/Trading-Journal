import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Globe, Copy, Check, CreditCard, Building, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  onClose: () => void;
  selectedPlan: 'pro';
  planPrice: number;
  isYearly: boolean;
  pkrRate: number;
}

interface PaymentFormData {
  location: 'pakistan' | 'international';
  transactionId: string;
  confirmTerms: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  onClose, 
  selectedPlan, 
  planPrice, 
  isYearly,
  pkrRate 
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'location' | 'payment' | 'confirmation'>('location');
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

  // Calculate expiry date based on plan
  const calculateExpiryDate = () => {
    const now = new Date();
    if (isYearly) {
      // Add 12 months
      return new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      // Add 1 month
      return new Date(now.setMonth(now.getMonth() + 1));
    }
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

  const handleLocationSelect = (location: 'pakistan' | 'international') => {
    setSelectedLocation(location);
    setStep('payment');
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!user || !selectedLocation) return;

    setIsSubmitting(true);
    try {
      // Calculate expiry date
      const expiryDate = calculateExpiryDate();
      
      // Calculate local currency amount
      const amount = selectedLocation === 'pakistan' 
        ? (isYearly ? planPrice * pkrRate : planPrice * pkrRate) 
        : planPrice;
      
      const paymentData = {
        userId: user.id,
        userEmail: user.email,
        userName: user.displayName,
        plan: selectedPlan,
        amount: amount,
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
        isYearly: isYearly,
        expiryDate: expiryDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'payments'), paymentData);
      
      setStep('confirmation');
      toast.success('Payment submitted successfully! We will review it within 24 hours.');
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLocation = () => {
    setStep('location');
    setSelectedLocation(null);
  };

  // Format currency with proper symbol
  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === 'PKR' ? '₨' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {step === 'location' && 'Select Payment Method'}
              {step === 'payment' && `Payment for ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`}
              {step === 'confirmation' && 'Payment Submitted'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {step === 'location' && 'Choose your location to see available payment options'}
              {step === 'payment' && selectedLocation === 'pakistan' 
                ? `Amount: ₨${(planPrice * pkrRate).toLocaleString()} (${isYearly ? 'Yearly' : 'Monthly'})`
                : step === 'payment' ? `Amount: $${planPrice.toLocaleString()} (${isYearly ? 'Yearly' : 'Monthly'})` 
                : 'Your payment is under review'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Step 1: Location Selection */}
          {step === 'location' && (
            <div className="space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Choose Your Location
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer different payment methods based on your location for your convenience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Pakistan Option */}
                <button
                  onClick={() => handleLocationSelect('pakistan')}
                  className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 transform hover:scale-105"
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
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {isYearly 
                        ? `₨${pkrYearlyPrice.toLocaleString()} (yearly)` 
                        : `₨${pkrMonthlyPrice.toLocaleString()} (monthly)`}
                    </div>
                  </div>
                </button>

                {/* International Option */}
                <button
                  onClick={() => handleLocationSelect('international')}
                  className="group relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 transform hover:scale-105"
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
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {isYearly 
                        ? `$${yearlyPrice.toLocaleString()} (yearly)` 
                        : `$${baseMonthlyPrice.toLocaleString()} (monthly)`}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 'payment' && selectedLocation && (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={handleBackToLocation}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                ← Back to location selection
              </button>

              {/* Subscription Details */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Subscription Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Plan:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {isYearly ? '12 months' : '1 month'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedLocation === 'pakistan' 
                        ? formatCurrency(isYearly ? pkrYearlyPrice : pkrMonthlyPrice, 'PKR')
                        : formatCurrency(isYearly ? yearlyPrice : baseMonthlyPrice, 'USD')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Expires on:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {calculateExpiryDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 p-2 rounded">
                  <AlertCircle className="h-4 w-4 inline-block mr-1" />
                  Your subscription will automatically expire after {isYearly ? '12 months' : '1 month'}. You'll need to manually renew to continue.
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Instructions
                </h3>
                
                {selectedLocation === 'pakistan' ? (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Please transfer <strong>₨{(isYearly ? pkrYearlyPrice : pkrMonthlyPrice).toLocaleString()}</strong> to the following account:
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Account Title:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">{pakistanAccount.accountTitle}</span>
                            <button
                              onClick={() => copyToClipboard(pakistanAccount.accountTitle, 'title')}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
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
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Please send <strong>${(isYearly ? yearlyPrice : baseMonthlyPrice).toLocaleString()} USD</strong> to the following Binance account:
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
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
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                            >
                              {copiedField === 'binanceName' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction ID Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        After making the payment, please enter your Transaction ID below. We will review and activate your account within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

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
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I confirm that I have made the payment and the transaction ID provided is accurate. I understand that providing false information may result in account suspension.
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
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Submitted Successfully!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your payment has been submitted for review. We will verify your transaction and activate your {selectedPlan} plan within 24 hours.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Subscription Details</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
                  <li>• Plan: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</li>
                  <li>• Duration: {isYearly ? '12 months' : '1 month'}</li>
                  <li>• Expires on: {calculateExpiryDate().toLocaleDateString()}</li>
                  <li>• You'll receive a renewal reminder 2 days before expiry</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
                  <li>• Our team will verify your payment within 24 hours</li>
                  <li>• You'll receive an email confirmation once approved</li>
                  <li>• Your account will be automatically upgraded to {selectedPlan} plan</li>
                  <li>• You can check your payment status in your account settings</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;