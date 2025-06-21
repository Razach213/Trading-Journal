# 🔥 Firebase Setup Guide - Fix API Key Error

## ⚠️ CRITICAL: You need to configure Firebase to fix the "auth/api-key-not-valid" error

### Step 1: Get Your Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** or create a new one
3. **Go to Project Settings** (gear icon)
4. **Scroll to "Your apps"** section
5. **Click on your web app** or create one if none exists
6. **Copy the configuration object**

### Step 2: Update Your .env File

Replace the placeholder values in your `.env` file with your actual Firebase config:

```env
# Replace these with your actual Firebase values
VITE_FIREBASE_API_KEY=AIzaSyBqJVJKqJKqJKqJKqJKqJKqJKqJKqJKqJK
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnopqr
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Enable Firebase Services

In your Firebase Console, enable these services:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in test mode
   - Choose your preferred location

3. **Storage** (optional)
   - Go to Storage
   - Get started

### Step 4: Deploy Security Rules

After updating your config, deploy the security rules:

```bash
firebase deploy --only firestore:rules,storage
```

### Step 5: Restart Development Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 Quick Fix Summary

1. **Get Firebase config** from console
2. **Update .env file** with real values
3. **Enable Authentication & Firestore** in console
4. **Restart dev server**

The "auth/api-key-not-valid" error will be resolved once you provide valid Firebase credentials!

## 🆘 Need Help?

If you're still having issues:
1. Double-check your API key is correct
2. Make sure your Firebase project is active
3. Verify all services are enabled
4. Check browser console for specific errors

The app will run in demo mode until Firebase is properly configured.