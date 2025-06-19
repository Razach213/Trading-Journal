# Firebase Database Rules Guide

## Overview
Ye comprehensive security rules aapke ZellaX trading journal ke liye banaye gaye hain. Ye rules ensure karte hain ke:

- Users sirf apna data access kar sakte hain
- Data validation properly hoti hai
- Security breaches se protection hai
- Performance optimized hai

## Security Features

### 🔐 Authentication
- Har operation ke liye authentication required hai
- Users sirf apna data access kar sakte hain
- Admin users ke liye special permissions

### 📊 Data Validation
- Trade data validation (price > 0, valid types, etc.)
- User data validation (required fields, valid plans)
- File upload validation (size limits, file types)

### 🛡️ Protection Features
- Read/Write permissions properly segregated
- Cloud Functions ke liye special write permissions
- Public data read-only access
- Sensitive operations restricted

## Collections Structure

### Users Collection (`/users/{userId}`)
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  plan: "free|pro|premium",
  role: "user|admin", // optional
  stripeCustomerId: "cus_xxx", // optional
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Permissions:**
- ✅ Users can read/write their own data
- ✅ Data validation for required fields
- ❌ Cannot modify createdAt after creation

### Trades Collection (`/trades/{tradeId}`)
```javascript
{
  userId: "user-id",
  symbol: "AAPL",
  type: "long|short",
  entryPrice: 150.00,
  exitPrice: 155.00, // optional
  quantity: 100,
  entryDate: timestamp,
  exitDate: timestamp, // optional
  status: "open|closed",
  pnl: 500.00, // optional
  pnlPercent: 3.33, // optional
  notes: "Trade notes", // optional
  tags: ["breakout", "earnings"], // array
  strategy: "Strategy name", // optional
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Permissions:**
- ✅ Users can CRUD their own trades
- ✅ Validation for required fields and data types
- ✅ Price and quantity must be positive
- ❌ Cannot modify userId or createdAt

### Subscriptions Collection (`/subscriptions/{subscriptionId}`)
```javascript
{
  userId: "user-id",
  stripeSubscriptionId: "sub_xxx",
  status: "active|canceled|past_due",
  plan: "pro|premium",
  currentPeriodStart: timestamp,
  currentPeriodEnd: timestamp,
  createdAt: timestamp
}
```

**Permissions:**
- ✅ Users can read their subscription data
- ❌ Only Cloud Functions can write (Stripe webhooks)

## File Storage Rules

### User Profile Images (`/users/{userId}/profile/`)
- ✅ Users can upload their profile images
- ✅ Image files only (JPEG, PNG, etc.)
- ✅ 5MB size limit
- ✅ Public read access

### Trade Attachments (`/users/{userId}/trades/{tradeId}/`)
- ✅ Users can upload trade screenshots
- ✅ Private access (only owner can read)
- ✅ Multiple file types supported

### Documents (`/users/{userId}/documents/`)
- ✅ Export files, reports, etc.
- ✅ PDF, CSV, Excel files
- ✅ 10MB size limit

## Deployment Commands

### Deploy Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy everything
firebase deploy
```

### Test Rules Locally
```bash
# Start emulators
firebase emulators:start

# Test with emulator UI
# Go to http://localhost:4000
```

## Security Best Practices

### ✅ Do's
- Always validate user input
- Use proper authentication checks
- Implement data validation
- Use indexes for performance
- Regular security audits

### ❌ Don'ts
- Never trust client-side data
- Don't expose sensitive information
- Avoid overly permissive rules
- Don't skip authentication checks
- Avoid complex nested queries without indexes

## Common Queries Supported

### Trades Queries
```javascript
// Get user's trades ordered by date
trades.where('userId', '==', userId)
      .orderBy('createdAt', 'desc')

// Filter by status
trades.where('userId', '==', userId)
      .where('status', '==', 'open')
      .orderBy('createdAt', 'desc')

// Filter by symbol
trades.where('userId', '==', userId)
      .where('symbol', '==', 'AAPL')
      .orderBy('createdAt', 'desc')

// Filter by strategy
trades.where('userId', '==', userId)
      .where('strategy', '==', 'Breakout')
      .orderBy('createdAt', 'desc')

// Filter by tags
trades.where('userId', '==', userId)
      .where('tags', 'array-contains', 'earnings')
      .orderBy('createdAt', 'desc')
```

## Error Handling

### Common Errors
- `permission-denied`: User doesn't have access
- `invalid-argument`: Data validation failed
- `not-found`: Document doesn't exist
- `already-exists`: Duplicate data

### Error Messages
Rules provide clear error messages for debugging:
```javascript
// Example validation with custom message
allow create: if isValidTrade(request.resource.data) ||
             error('Invalid trade data: price must be positive');
```

## Monitoring & Analytics

### Security Monitoring
- Monitor failed permission attempts
- Track unusual access patterns
- Set up alerts for security violations

### Performance Monitoring
- Monitor query performance
- Track index usage
- Optimize slow queries

## Support & Troubleshooting

### Common Issues
1. **Permission Denied**: Check authentication and ownership
2. **Validation Failed**: Verify data structure and types
3. **Index Missing**: Add required indexes for complex queries
4. **File Upload Failed**: Check file size and type restrictions

### Debug Tips
```javascript
// Enable debug mode in development
firebase.firestore().enableNetwork()
firebase.firestore().settings({ ignoreUndefinedProperties: true })
```

---

**Note**: Ye rules production-ready hain aur comprehensive security provide karte hain. Regular updates aur monitoring ke saath use karein.