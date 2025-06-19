# Environment Setup Guide

## 1. Copy Environment File
```bash
cp .env.example .env
```

## 2. Firebase Configuration

### Get Firebase Config:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Click on your web app or create one
6. Copy the config values

### Update .env file:
```env
VITE_FIREBASE_API_KEY=AIzaSyBqJVJKqJKqJKqJKqJKqJKqJKqJKqJKqJK
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnopqr
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. Stripe Configuration (Optional)

### Get Stripe Keys:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to Developers > API keys
3. Copy Publishable key and Secret key

### Update .env file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
VITE_STRIPE_SECRET_KEY=sk_test_51234567890abcdef
```

## 4. Development vs Production

### Development (.env):
```env
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_EMULATORS=true
```

### Production (.env.production):
```env
VITE_APP_URL=https://your-domain.com
VITE_ENABLE_EMULATORS=false
```

## 5. Security Notes

- Never commit `.env` files to git
- Use different API keys for development and production
- Keep secret keys secure and never expose them in client code
- Use Firebase security rules to protect your data

## 6. Verification

After setting up environment variables, verify they're working:

```bash
# Start development server
npm run dev

# Check if Firebase is connected
# Check browser console for any errors
# Test authentication flow
```

## 7. Common Issues

### Firebase not connecting:
- Check if all required environment variables are set
- Verify Firebase project is active
- Check browser console for specific errors

### Stripe not working:
- Ensure you're using test keys in development
- Check if Stripe publishable key is correctly set
- Verify webhook endpoints are configured

## 8. Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID | No |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |
| `VITE_STRIPE_SECRET_KEY` | Stripe secret key | No |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |
| `VITE_SUPPORT_EMAIL` | Support email address | No |
| `VITE_ENABLE_EMULATORS` | Enable Firebase emulators | No |