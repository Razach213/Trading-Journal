import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Admin email check function
const isAdminUser = (email: string): boolean => {
  const adminEmails = ['thealiraza22@gmail.com', 'ramdanmubarak10@gmail.com'];
  return adminEmails.includes(email);
};

// Get all users for admin panel
export const getAllUsers = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated and is admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const usersSnapshot = await admin.firestore().collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { users };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch users');
  }
});

// Get system analytics for admin panel
export const getSystemAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    // Get total users
    const usersSnapshot = await admin.firestore().collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Get total trades
    const tradesSnapshot = await admin.firestore().collection('trades').get();
    const totalTrades = tradesSnapshot.size;

    // Get active users (users who logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersSnapshot = await admin.firestore()
      .collection('users')
      .where('lastLoginAt', '>=', thirtyDaysAgo)
      .get();
    const activeUsers = activeUsersSnapshot.size;

    // Calculate revenue (mock data for now)
    const revenue = totalUsers * 19; // Assuming average $19 per user

    const analytics = {
      totalUsers,
      activeUsers,
      totalTrades,
      revenue,
      conversionRate: 12.5,
      churnRate: 3.2,
      avgSessionTime: '24m 15s',
      supportTickets: 45
    };

    return { analytics };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch analytics');
  }
});

// Get revenue data for admin panel
export const getRevenueData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    // Mock revenue data - in real app, this would come from Stripe or payment processor
    const revenueData = [
      { month: 'Jan', revenue: 8500, users: 1200 },
      { month: 'Feb', revenue: 12000, users: 1800 },
      { month: 'Mar', revenue: 15500, users: 2400 },
      { month: 'Apr', revenue: 18200, users: 2900 },
      { month: 'May', revenue: 22000, users: 3500 },
      { month: 'Jun', revenue: 25800, users: 4200 }
    ];

    const revenueMetrics = {
      monthlyRecurringRevenue: 125000,
      averageRevenuePerUser: 28.50,
      customerLifetimeValue: 342,
      revenueByPlan: {
        free: 0,
        pro: 85500,
        premium: 39500
      },
      paymentMethods: {
        creditCard: 85,
        paypal: 12,
        bankTransfer: 3
      }
    };

    return { revenueData, revenueMetrics };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch revenue data');
  }
});

// Get system health for admin panel
export const getSystemHealth = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const systemHealth = {
      database: {
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '45ms'
      },
      api: {
        status: 'operational',
        uptime: '99.9%',
        responseTime: '150ms'
      },
      email: {
        status: 'degraded',
        uptime: '98.5%',
        responseTime: '2min'
      },
      security: {
        status: 'secure',
        threatsDetected: 0,
        lastScan: new Date()
      }
    };

    const serverMetrics = {
      cpu: 45,
      memory: 62,
      disk: 78,
      network: 23
    };

    const recentActivities = [
      {
        type: 'success',
        message: 'Database backup completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: 'warning',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        type: 'success',
        message: 'Security scan completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        type: 'success',
        message: 'System update deployed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    return { systemHealth, serverMetrics, recentActivities };
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch system health');
  }
});

// Get security data for admin panel
export const getSecurityData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const securityMetrics = {
      failedLoginAttempts: 23,
      activeSessions: 1247,
      securityScore: 98,
      threatsBlocked: 156,
      lastSecurityScan: new Date()
    };

    const securityEvents = [
      {
        type: 'critical',
        title: 'Multiple failed login attempts',
        description: 'IP: 192.168.1.100 - 5 attempts in 10 minutes',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'high'
      },
      {
        type: 'warning',
        title: 'Unusual login location',
        description: 'User logged in from new country: Germany',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        severity: 'medium'
      },
      {
        type: 'success',
        title: 'Security scan completed',
        description: 'No vulnerabilities detected',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        severity: 'low'
      }
    ];

    const securitySettings = {
      twoFactorAuth: true,
      sessionTimeout: 30, // minutes
      ipWhitelist: false,
      passwordPolicy: 'strong',
      encryptionLevel: 'AES-256'
    };

    return { securityMetrics, securityEvents, securitySettings };
  } catch (error) {
    console.error('Error fetching security data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch security data');
  }
});

// Update user data (admin only)
export const updateUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const { userId, updates } = data;
    
    if (!userId || !updates) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID and updates are required');
    }

    await admin.firestore().collection('users').doc(userId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update user');
  }
});

// Delete user (admin only)
export const deleteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const { userId } = data;
    
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    // Delete user from Authentication
    await admin.auth().deleteUser(userId);
    
    // Delete user document
    await admin.firestore().collection('users').doc(userId).delete();
    
    // Delete user's trades
    const tradesSnapshot = await admin.firestore()
      .collection('trades')
      .where('userId', '==', userId)
      .get();
    
    const batch = admin.firestore().batch();
    tradesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user');
  }
});

// Export data (admin only)
export const exportData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!isAdminUser(context.auth.token.email || '')) {
    throw new functions.https.HttpsError('permission-denied', 'Only admin users can access this function');
  }

  try {
    const { type } = data;
    
    let exportData: any = {};
    
    switch (type) {
      case 'users':
        const usersSnapshot = await admin.firestore().collection('users').get();
        exportData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        break;
        
      case 'trades':
        const tradesSnapshot = await admin.firestore().collection('trades').get();
        exportData = tradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        break;
        
      case 'analytics':
        // Return analytics data
        exportData = {
          exportDate: new Date(),
          totalUsers: (await admin.firestore().collection('users').get()).size,
          totalTrades: (await admin.firestore().collection('trades').get()).size
        };
        break;
        
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Invalid export type');
    }

    return { data: exportData, type, exportDate: new Date() };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to export data');
  }
});