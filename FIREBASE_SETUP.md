# Firebase Setup Guide for ZellaX

## Prerequisites
- Node.js (v16 or higher)
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `zellax-trading-journal`
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firebase Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google sign-in
4. Add your domain to authorized domains

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in test mode (we'll deploy security rules later)
4. Choose location closest to your users

### Storage
1. Go to Storage
2. Click "Get started"
3. Start in test mode

### Functions (Optional)
1. Go to Functions
2. Click "Get started"
3. Upgrade to Blaze plan (pay-as-you-go) for Cloud Functions

## Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register app with name "ZellaX"
5. Copy the configuration object

## Step 4: Update Configuration Files

### Update src/lib/firebase.ts
Replace the firebaseConfig object with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Update .firebaserc
Replace "zellax-trading-journal" with your actual project ID.

## Step 5: Deploy Security Rules and Indexes

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init

# Select:
# - Firestore (rules and indexes)
# - Functions (if using)
# - Hosting
# - Storage

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Step 6: Set up Stripe (Optional)

### Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account and verify
3. Get API keys from Developers > API keys

### Configure Stripe in Firebase Functions
```bash
# Set Stripe configuration
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"

# Deploy functions
firebase deploy --only functions
```

### Create Stripe Products and Prices
1. Go to Stripe Dashboard > Products
2. Create products for your pricing plans
3. Note down the price IDs for integration

## Step 7: Deploy to Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Step 8: Environment Variables (Optional)

Create `.env.local` file for local development:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Testing

### Local Development with Emulators
```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start your dev server
npm run dev
```

### Production Testing
1. Deploy your app: `firebase deploy`
2. Test authentication flow
3. Test trade creation and management
4. Test Stripe integration (if implemented)

## Security Checklist
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Authentication properly configured
- [ ] API keys secured (not exposed in client code)
- [ ] Stripe webhooks configured with proper endpoints

## Monitoring
1. Set up Firebase Performance Monitoring
2. Enable Crashlytics for error tracking
3. Monitor Firestore usage and costs
4. Set up billing alerts

## Support
- Firebase Documentation: https://firebase.google.com/docs
- Stripe Documentation: https://stripe.com/docs
- React Documentation: https://react.dev/

---

**Note**: Replace all placeholder values with your actual Firebase project configuration before deploying to production.