// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "neomart-ecommerce.firebaseapp.com",
    projectId: "neomart-ecommerce",
    storageBucket: "neomart-ecommerce.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789",
    measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure auth settings
auth.useDeviceLanguage();

// Export default app for convenience
export default app;

// Firestore Security Rules (Reference - to be implemented in Firebase Console)
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are read-only for all users, write for admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Categories are read-only for all users
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Orders can be read and written by the order owner only
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Cart items can be read and written by the cart owner only
    match /carts/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reviews can be read by everyone, written by authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Wishlist items can be read and written by the wishlist owner only
    match /wishlists/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

// Firebase Storage Security Rules (Reference)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images can be read by everyone
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // User profile images can be managed by the user
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

// Helper functions for Firestore operations
export const FirebaseHelpers = {
    // Collection references
    collections: {
        users: 'users',
        products: 'products',
        categories: 'categories',
        orders: 'orders',
        reviews: 'reviews',
        carts: 'carts',
        wishlists: 'wishlists'
    },
    
    // Error handling
    handleError: (error) => {
        console.error('Firebase Error:', error);
        
        const errorMessages = {
            'auth/user-not-found': 'No user found with this email address.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'This email address is already registered.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'permission-denied': 'You do not have permission to perform this action.',
            'not-found': 'The requested resource was not found.',
            'already-exists': 'The resource already exists.',
            'failed-precondition': 'The operation failed due to a failed precondition.',
            'aborted': 'The operation was aborted.',
            'out-of-range': 'The operation was attempted past the valid range.',
            'unimplemented': 'This operation is not implemented.',
            'internal': 'An internal error occurred.',
            'unavailable': 'The service is currently unavailable.',
            'data-loss': 'Unrecoverable data loss or corruption.',
            'unauthenticated': 'You must be logged in to perform this action.'
        };
        
        return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
    },
    
    // Timestamp helper
    serverTimestamp: () => {
        return new Date();
    },
    
    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Analytics helper (if needed)
export const logEvent = (eventName, parameters = {}) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    console.log(`Event logged: ${eventName}`, parameters);
};

// Performance monitoring
export const trace = (traceName) => {
    const startTime = performance.now();
    
    return {
        stop: () => {
            const endTime = performance.now();
            console.log(`Trace ${traceName}: ${endTime - startTime}ms`);
        }
    };
};

console.log('Firebase initialized successfully');