# ZellaX Deployment Guide

## Quick Deployment Steps

### 1. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### 2. Build and Deploy
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### 3. Environment Configuration
Update `src/lib/firebase.ts` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. Enable Firebase Services
- Authentication (Email/Password + Google)
- Firestore Database
- Storage
- Hosting

### 5. Deploy Security Rules
```bash
firebase deploy --only firestore:rules,storage
```

## Production Checklist
- [ ] Firebase configuration updated
- [ ] Security rules deployed
- [ ] Authentication providers enabled
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Performance monitoring enabled

## Post-Deployment
1. Test all authentication flows
2. Verify trade creation and management
3. Check responsive design on all devices
4. Monitor Firebase usage and costs

Your ZellaX trading journal will be live at: `https://your-project-id.web.app`