import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Payment } from '../types';
import toast from 'react-hot-toast';

export const usePayments = (userId: string | undefined) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      setError(null);
      setPayments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        paymentsQuery, 
        (snapshot) => {
          try {
            const paymentsData: Payment[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              
              const payment: Payment = {
                id: doc.id,
                userId: data.userId || '',
                userEmail: data.userEmail || '',
                userName: data.userName || '',
                plan: data.plan || 'pro',
                amount: data.amount || 0,
                currency: data.currency || 'USD',
                paymentMethod: data.paymentMethod || 'international',
                accountDetails: data.accountDetails || {},
                transactionId: data.transactionId || '',
                status: data.status || 'pending',
                submittedAt: data.submittedAt?.toDate() || new Date(),
                reviewedAt: data.reviewedAt?.toDate() || null,
                reviewedBy: data.reviewedBy || null,
                adminNotes: data.adminNotes || null,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
              };
              
              paymentsData.push(payment);
            });
            
            setPayments(paymentsData);
            setError(null);
          } catch (err) {
            console.error('Error processing payments data:', err);
            setError('Failed to process payments data');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error fetching payments:', err);
          setLoading(false);
          
          if (err.code === 'permission-denied') {
            setError('You don\'t have permission to access this data. Please sign in again.');
          } else if (err.code === 'failed-precondition') {
            setError('Database index is being created. Please try again in a few minutes.');
          } else if (err.code === 'unavailable') {
            setError('Service is temporarily unavailable. Please check your internet connection.');
          } else {
            setError('Failed to load payments. Please try refreshing the page.');
          }
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up payments listener:', err);
      setLoading(false);
      setError('Failed to initialize payments. Please refresh the page.');
    }
  }, [userId]);

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      const payment = {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'payments'), payment);
      toast.success('Payment submitted successfully!');
    } catch (error: any) {
      console.error('Error adding payment:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check your authentication and try again.');
      } else {
        toast.error(error.message || 'Failed to submit payment');
      }
      throw error;
    }
  };

  return {
    payments,
    loading,
    error,
    addPayment
  };
};