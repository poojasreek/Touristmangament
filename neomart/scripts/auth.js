// Authentication System for NeoMart

import { auth, db, FirebaseHelpers } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { DOM, Validation, Storage } from './utils.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authListeners = [];
        
        this.init();
    }
    
    init() {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.isAuthenticated = !!user;
            
            this.updateAuthUI();
            this.notifyListeners(user);
            
            if (user) {
                this.syncUserData(user);
            }
        });
        
        // Initialize auth UI components
        this.initAuthUI();
    }
    
    // Initialize authentication UI components
    initAuthUI() {
        const authBtn = DOM.select('#authBtn');
        const mobileAuthBtn = DOM.select('#mobileAuthBtn');
        
        if (authBtn) {
            authBtn.addEventListener('click', this.handleAuthButtonClick.bind(this));
        }
        
        if (mobileAuthBtn) {
            mobileAuthBtn.addEventListener('click', this.handleAuthButtonClick.bind(this));
        }
    }
    
    // Handle auth button click
    handleAuthButtonClick() {
        if (this.isAuthenticated) {
            this.showUserMenu();
        } else {
            window.location.href = 'auth.html';
        }
    }
    
    // Show user menu dropdown
    showUserMenu() {
        const userMenuHTML = `
            <div class="user-menu bg-white rounded-lg shadow-xl p-4 min-w-48">
                <div class="border-b border-gray-200 pb-3 mb-3">
                    <p class="font-medium text-gray-900">${this.currentUser.displayName || 'User'}</p>
                    <p class="text-sm text-gray-500">${this.currentUser.email}</p>
                </div>
                <ul class="space-y-2">
                    <li><a href="profile.html" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Profile</a></li>
                    <li><a href="orders.html" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Orders</a></li>
                    <li><a href="wishlist.html" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Wishlist</a></li>
                    <li><hr class="my-2"></li>
                    <li><button onclick="authManager.logout()" class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">Sign Out</button></li>
                </ul>
            </div>
        `;
        
        // Create and show dropdown (simplified implementation)
        console.log('User menu would show here');
    }
    
    // Register new user
    async register(email, password, displayName, additionalData = {}) {
        try {
            this.showLoading('Creating your account...');
            
            // Validate input
            if (!Validation.email(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            const passwordCheck = Validation.password(password);
            if (!passwordCheck.isValid) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
            }
            
            if (!displayName || displayName.trim().length < 2) {
                throw new Error('Please enter your full name');
            }
            
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user profile
            await updateProfile(user, {
                displayName: displayName.trim()
            });
            
            // Send email verification
            await sendEmailVerification(user);
            
            // Create user document in Firestore
            await this.createUserDocument(user, {
                email: email,
                displayName: displayName.trim(),
                createdAt: new Date(),
                emailVerified: false,
                role: 'customer',
                ...additionalData
            });
            
            this.hideLoading();
            this.showSuccess('Account created successfully! Please check your email for verification.');
            
            return { success: true, user };
            
        } catch (error) {
            this.hideLoading();
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Login user
    async login(email, password, rememberMe = false) {
        try {
            this.showLoading('Signing you in...');
            
            // Validate input
            if (!Validation.email(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!password || password.length < 6) {
                throw new Error('Please enter your password');
            }
            
            // Sign in user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Store remember me preference
            if (rememberMe) {
                Storage.local.set('remember_user', true);
            }
            
            this.hideLoading();
            this.showSuccess('Welcome back!');
            
            // Redirect to intended page or home
            const redirectUrl = Storage.session.get('auth_redirect', 'index.html');
            Storage.session.remove('auth_redirect');
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
            
            return { success: true, user };
            
        } catch (error) {
            this.hideLoading();
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Login with Google
    async loginWithGoogle() {
        try {
            this.showLoading('Connecting with Google...');
            
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Check if user document exists, create if not
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await this.createUserDocument(user, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    provider: 'google',
                    createdAt: new Date(),
                    emailVerified: user.emailVerified,
                    role: 'customer'
                });
            }
            
            this.hideLoading();
            this.showSuccess('Successfully signed in with Google!');
            
            // Redirect
            const redirectUrl = Storage.session.get('auth_redirect', 'index.html');
            Storage.session.remove('auth_redirect');
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
            
            return { success: true, user };
            
        } catch (error) {
            this.hideLoading();
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Logout user
    async logout() {
        try {
            await signOut(auth);
            
            // Clear stored data
            Storage.local.remove('remember_user');
            Storage.session.clear();
            
            this.showSuccess('You have been signed out successfully');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
            return { success: true };
            
        } catch (error) {
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Send password reset email
    async resetPassword(email) {
        try {
            if (!Validation.email(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            this.showLoading('Sending reset email...');
            
            await sendPasswordResetEmail(auth, email);
            
            this.hideLoading();
            this.showSuccess('Password reset email sent! Please check your inbox.');
            
            return { success: true };
            
        } catch (error) {
            this.hideLoading();
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Create user document in Firestore
    async createUserDocument(user, additionalData = {}) {
        const userRef = doc(db, 'users', user.uid);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            lastLoginAt: new Date(),
            ...additionalData
        };
        
        await setDoc(userRef, userData, { merge: true });
        return userData;
    }
    
    // Sync user data with Firestore
    async syncUserData(user) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                // Update last login time
                await updateDoc(userRef, {
                    lastLoginAt: new Date(),
                    emailVerified: user.emailVerified
                });
            } else {
                // Create user document if it doesn't exist
                await this.createUserDocument(user);
            }
        } catch (error) {
            console.error('Error syncing user data:', error);
        }
    }
    
    // Update user profile
    async updateUserProfile(data) {
        if (!this.isAuthenticated) {
            throw new Error('You must be logged in to update your profile');
        }
        
        try {
            this.showLoading('Updating profile...');
            
            // Update Firebase Auth profile
            if (data.displayName !== undefined) {
                await updateProfile(this.currentUser, {
                    displayName: data.displayName
                });
            }
            
            // Update Firestore user document
            const userRef = doc(db, 'users', this.currentUser.uid);
            await updateDoc(userRef, {
                ...data,
                updatedAt: new Date()
            });
            
            this.hideLoading();
            this.showSuccess('Profile updated successfully!');
            
            return { success: true };
            
        } catch (error) {
            this.hideLoading();
            const message = FirebaseHelpers.handleError(error);
            this.showError(message);
            return { success: false, error: message };
        }
    }
    
    // Get user data from Firestore
    async getUserData(userId = null) {
        const uid = userId || (this.currentUser && this.currentUser.uid);
        if (!uid) return null;
        
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return userDoc.data();
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }
    
    // Check if user has required permissions
    hasPermission(requiredRole = 'customer') {
        // Implementation would check user role from Firestore
        return this.isAuthenticated;
    }
    
    // Require authentication for protected pages
    requireAuth(redirectUrl = 'auth.html') {
        if (!this.isAuthenticated) {
            // Store current URL for redirect after login
            Storage.session.set('auth_redirect', window.location.href);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
    
    // Update authentication UI
    updateAuthUI() {
        const authBtn = DOM.select('#authBtn');
        const mobileAuthBtn = DOM.select('#mobileAuthBtn');
        
        if (authBtn) {
            if (this.isAuthenticated) {
                authBtn.textContent = this.currentUser.displayName || 'Account';
                authBtn.classList.remove('bg-navy-800', 'text-white');
                authBtn.classList.add('bg-gray-100', 'text-navy-800');
            } else {
                authBtn.textContent = 'Sign In';
                authBtn.classList.remove('bg-gray-100', 'text-navy-800');
                authBtn.classList.add('bg-navy-800', 'text-white');
            }
        }
        
        if (mobileAuthBtn) {
            if (this.isAuthenticated) {
                mobileAuthBtn.textContent = this.currentUser.displayName || 'Account';
            } else {
                mobileAuthBtn.textContent = 'Sign In';
            }
        }
    }
    
    // Add authentication listener
    onAuthStateChange(callback) {
        this.authListeners.push(callback);
        
        // Call immediately with current state
        if (this.currentUser !== undefined) {
            callback(this.currentUser, this.isAuthenticated);
        }
    }
    
    // Remove authentication listener
    offAuthStateChange(callback) {
        const index = this.authListeners.indexOf(callback);
        if (index > -1) {
            this.authListeners.splice(index, 1);
        }
    }
    
    // Notify all listeners
    notifyListeners(user) {
        this.authListeners.forEach(callback => {
            try {
                callback(user, this.isAuthenticated);
            } catch (error) {
                console.error('Error in auth listener:', error);
            }
        });
    }
    
    // UI Helper Methods
    showLoading(message = 'Loading...') {
        // Create or update loading overlay
        let overlay = DOM.select('#authLoadingOverlay');
        if (!overlay) {
            overlay = DOM.create('div', {
                id: 'authLoadingOverlay',
                className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            }, `
                <div class="bg-white rounded-lg p-8 flex items-center space-x-4">
                    <div class="spinner"></div>
                    <span class="text-lg font-medium" id="loadingMessage">${message}</span>
                </div>
            `);
            document.body.appendChild(overlay);
        } else {
            DOM.select('#loadingMessage').textContent = message;
            DOM.show(overlay);
        }
    }
    
    hideLoading() {
        const overlay = DOM.select('#authLoadingOverlay');
        if (overlay) {
            DOM.hide(overlay);
        }
    }
    
    showSuccess(message) {
        this.createToast(message, 'success');
    }
    
    showError(message) {
        this.createToast(message, 'error');
    }
    
    showInfo(message) {
        this.createToast(message, 'info');
    }
    
    createToast(message, type = 'info') {
        const toast = DOM.create('div', {
            className: `toast ${type} show`
        }, `
            <div class="flex items-center">
                <div class="flex-1">
                    <p class="font-medium">${message}</p>
                </div>
                <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `);
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export auth manager and helper functions
export default authManager;

export const {
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    getUserData,
    hasPermission,
    requireAuth,
    onAuthStateChange,
    offAuthStateChange
} = authManager;

// Make auth manager globally available
window.authManager = authManager;

console.log('Authentication system initialized');