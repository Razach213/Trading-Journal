import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

// Create Stripe customer when user signs up
export const createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        firebaseUID: user.uid,
      },
    });

    // Save customer ID to Firestore
    await admin.firestore().collection('users').doc(user.uid).update({
      stripeCustomerId: customer.id,
    });

    console.log(`Created Stripe customer ${customer.id} for user ${user.uid}`);
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
  }
});

// Create checkout session
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { priceId, successUrl, cancelUrl } = data;
    
    // Get user's Stripe customer ID
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    if (!userData?.stripeCustomerId) {
      throw new functions.https.HttpsError('failed-precondition', 'No Stripe customer found');
    }

    const session = await stripe.checkout.sessions.create({
      customer: userData.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        firebaseUID: context.auth.uid,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Unable to create checkout session');
  }
});

// Handle successful payments
export const handleSuccessfulPayment = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const firebaseUID = session.metadata?.firebaseUID;

    if (firebaseUID) {
      try {
        // Update user's subscription status
        await admin.firestore().collection('users').doc(firebaseUID).update({
          plan: 'pro', // or determine plan based on price
          subscriptionStatus: 'active',
          subscriptionId: session.subscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Updated subscription for user ${firebaseUID}`);
      } catch (error) {
        console.error('Error updating user subscription:', error);
      }
    }
  }

  res.json({ received: true });
});

// Calculate trading statistics
export const calculateTradingStats = functions.firestore
  .document('trades/{tradeId}')
  .onWrite(async (change, context) => {
    const userId = change.after.exists ? change.after.data()?.userId : change.before.data()?.userId;
    
    if (!userId) return;

    try {
      // Get all trades for the user
      const tradesSnapshot = await admin.firestore()
        .collection('trades')
        .where('userId', '==', userId)
        .get();

      const trades = tradesSnapshot.docs.map(doc => doc.data());
      const closedTrades = trades.filter(trade => trade.status === 'closed' && trade.pnl !== undefined);

      if (closedTrades.length === 0) return;

      // Calculate statistics
      const winningTrades = closedTrades.filter(trade => trade.pnl > 0);
      const losingTrades = closedTrades.filter(trade => trade.pnl < 0);
      
      const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const totalWins = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
      
      const stats = {
        totalTrades: trades.length,
        closedTrades: closedTrades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
        totalPnL,
        avgWin: winningTrades.length > 0 ? totalWins / winningTrades.length : 0,
        avgLoss: losingTrades.length > 0 ? totalLosses / losingTrades.length : 0,
        profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
        largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
        largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save stats to user document
      await admin.firestore().collection('users').doc(userId).update({
        tradingStats: stats,
      });

      console.log(`Updated trading stats for user ${userId}`);
    } catch (error) {
      console.error('Error calculating trading stats:', error);
    }
  });