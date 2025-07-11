// Cart Management System for NeoMart

import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { Storage, StringUtils, DOM } from './utils.js';

class CartManager {
    constructor() {
        this.cart = [];
        this.cartKey = 'neomart_cart';
        this.isAuthenticated = false;
        this.currentUser = null;
        this.cartListeners = [];
        
        this.init();
    }
    
    init() {
        // Load cart from localStorage initially
        this.loadCartFromStorage();
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.isAuthenticated = !!user;
            
            if (user) {
                this.syncCartWithFirebase();
            } else {
                this.loadCartFromStorage();
            }
        });
        
        // Update cart UI on page load
        this.updateCartUI();
    }
    
    // Load cart from localStorage
    loadCartFromStorage() {
        const storedCart = Storage.local.get(this.cartKey, []);
        this.cart = Array.isArray(storedCart) ? storedCart : [];
        this.updateCartUI();
        this.notifyListeners();
    }
    
    // Save cart to localStorage
    saveCartToStorage() {
        Storage.local.set(this.cartKey, this.cart);
    }
    
    // Sync cart with Firebase for authenticated users
    async syncCartWithFirebase() {
        if (!this.isAuthenticated || !this.currentUser) return;
        
        try {
            const cartRef = doc(db, 'carts', this.currentUser.uid);
            const cartDoc = await getDoc(cartRef);
            
            if (cartDoc.exists()) {
                // Load cart from Firebase
                const firebaseCart = cartDoc.data().items || [];
                
                // Merge with local cart (prioritize local cart items)
                const mergedCart = this.mergeCartItems(this.cart, firebaseCart);
                this.cart = mergedCart;
                
                // Save merged cart back to Firebase
                await setDoc(cartRef, {
                    items: this.cart,
                    updatedAt: new Date(),
                    userId: this.currentUser.uid
                });
            } else {
                // Save local cart to Firebase
                await setDoc(cartRef, {
                    items: this.cart,
                    updatedAt: new Date(),
                    userId: this.currentUser.uid
                });
            }
            
            // Set up real-time listener for cart updates
            this.setupCartListener();
            
        } catch (error) {
            console.error('Error syncing cart with Firebase:', error);
        }
        
        this.updateCartUI();
        this.notifyListeners();
    }
    
    // Setup real-time cart listener
    setupCartListener() {
        if (!this.isAuthenticated || !this.currentUser) return;
        
        const cartRef = doc(db, 'carts', this.currentUser.uid);
        
        onSnapshot(cartRef, (doc) => {
            if (doc.exists()) {
                const firebaseCart = doc.data().items || [];
                this.cart = firebaseCart;
                this.saveCartToStorage();
                this.updateCartUI();
                this.notifyListeners();
            }
        });
    }
    
    // Merge cart items (local takes priority for conflicts)
    mergeCartItems(localCart, firebaseCart) {
        const merged = [...localCart];
        
        firebaseCart.forEach(firebaseItem => {
            const existingIndex = merged.findIndex(item => 
                item.id === firebaseItem.id && 
                JSON.stringify(item.options) === JSON.stringify(firebaseItem.options)
            );
            
            if (existingIndex === -1) {
                merged.push(firebaseItem);
            }
            // Local item takes priority, so we don't update existing items
        });
        
        return merged;
    }
    
    // Add item to cart
    async addItem(product, quantity = 1, options = {}) {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: parseInt(quantity),
            options: options,
            addedAt: new Date().toISOString()
        };
        
        // Check if item already exists with same options
        const existingIndex = this.cart.findIndex(item => 
            item.id === cartItem.id && 
            JSON.stringify(item.options) === JSON.stringify(cartItem.options)
        );
        
        if (existingIndex > -1) {
            // Update quantity of existing item
            this.cart[existingIndex].quantity += cartItem.quantity;
        } else {
            // Add new item
            this.cart.push(cartItem);
        }
        
        await this.saveCart();
        this.updateCartUI();
        this.notifyListeners();
        this.showCartNotification('Item added to cart!', 'success');
        
        return true;
    }
    
    // Remove item from cart
    async removeItem(itemId, options = {}) {
        const index = this.cart.findIndex(item => 
            item.id === itemId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (index > -1) {
            const removedItem = this.cart.splice(index, 1)[0];
            await this.saveCart();
            this.updateCartUI();
            this.notifyListeners();
            this.showCartNotification(`${removedItem.name} removed from cart`, 'info');
            return true;
        }
        
        return false;
    }
    
    // Update item quantity
    async updateQuantity(itemId, quantity, options = {}) {
        const index = this.cart.findIndex(item => 
            item.id === itemId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (index > -1) {
            if (quantity <= 0) {
                return this.removeItem(itemId, options);
            }
            
            this.cart[index].quantity = parseInt(quantity);
            await this.saveCart();
            this.updateCartUI();
            this.notifyListeners();
            return true;
        }
        
        return false;
    }
    
    // Clear entire cart
    async clearCart() {
        this.cart = [];
        await this.saveCart();
        this.updateCartUI();
        this.notifyListeners();
        this.showCartNotification('Cart cleared', 'info');
    }
    
    // Save cart (localStorage and Firebase)
    async saveCart() {
        this.saveCartToStorage();
        
        if (this.isAuthenticated && this.currentUser) {
            try {
                const cartRef = doc(db, 'carts', this.currentUser.uid);
                await setDoc(cartRef, {
                    items: this.cart,
                    updatedAt: new Date(),
                    userId: this.currentUser.uid
                });
            } catch (error) {
                console.error('Error saving cart to Firebase:', error);
            }
        }
    }
    
    // Get cart items
    getItems() {
        return this.cart;
    }
    
    // Get item count
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Get cart subtotal (before tax and shipping)
    getSubtotal() {
        return this.getTotal();
    }
    
    // Calculate tax (8.25% default)
    getTax(taxRate = 0.0825) {
        return this.getSubtotal() * taxRate;
    }
    
    // Calculate shipping (free over $50, otherwise $5.99)
    getShipping(freeShippingThreshold = 50, shippingCost = 5.99) {
        return this.getSubtotal() >= freeShippingThreshold ? 0 : shippingCost;
    }
    
    // Get final total with tax and shipping
    getFinalTotal(taxRate = 0.0825) {
        return this.getSubtotal() + this.getTax(taxRate) + this.getShipping();
    }
    
    // Update cart UI
    updateCartUI() {
        const cartCount = DOM.select('#cartCount');
        const mobileCartCount = DOM.select('#mobileCartCount');
        
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        
        if (mobileCartCount) {
            mobileCartCount.textContent = this.getItemCount();
        }
        
        // Update cart badge visibility
        const badges = DOM.selectAll('.cart-badge');
        badges.forEach(badge => {
            if (this.getItemCount() > 0) {
                DOM.show(badge);
            } else {
                DOM.hide(badge);
            }
        });
    }
    
    // Show cart notification
    showCartNotification(message, type = 'info') {
        this.createToast(message, type);
    }
    
    // Create toast notification
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
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Add cart listener
    onCartChange(callback) {
        this.cartListeners.push(callback);
    }
    
    // Remove cart listener
    offCartChange(callback) {
        const index = this.cartListeners.indexOf(callback);
        if (index > -1) {
            this.cartListeners.splice(index, 1);
        }
    }
    
    // Notify all listeners
    notifyListeners() {
        this.cartListeners.forEach(callback => {
            try {
                callback(this.cart);
            } catch (error) {
                console.error('Error in cart listener:', error);
            }
        });
    }
    
    // Get cart summary for checkout
    getCartSummary() {
        return {
            items: this.cart,
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            tax: this.getTax(),
            shipping: this.getShipping(),
            total: this.getFinalTotal()
        };
    }
    
    // Validate cart items (check availability, prices, etc.)
    async validateCart() {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        for (const item of this.cart) {
            // Check if item still exists and is available
            try {
                const productRef = doc(db, 'products', item.id);
                const productDoc = await getDoc(productRef);
                
                if (!productDoc.exists()) {
                    validation.isValid = false;
                    validation.errors.push(`Product "${item.name}" is no longer available`);
                    continue;
                }
                
                const product = productDoc.data();
                
                // Check stock
                if (product.stock < item.quantity) {
                    validation.isValid = false;
                    validation.errors.push(`Only ${product.stock} units of "${item.name}" available`);
                }
                
                // Check price changes
                if (Math.abs(product.price - item.price) > 0.01) {
                    validation.warnings.push(`Price of "${item.name}" has changed from ${StringUtils.formatCurrency(item.price)} to ${StringUtils.formatCurrency(product.price)}`);
                }
                
            } catch (error) {
                console.error('Error validating cart item:', error);
                validation.warnings.push(`Could not validate "${item.name}"`);
            }
        }
        
        return validation;
    }
}

// Create global cart manager instance
const cartManager = new CartManager();

// Export cart manager and helper functions
export default cartManager;

export const {
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity: updateCartQuantity,
    clearCart,
    getItems: getCartItems,
    getItemCount: getCartItemCount,
    getTotal: getCartTotal,
    getCartSummary,
    onCartChange,
    offCartChange
} = cartManager;

// Initialize cart functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    // Cart button click handler
    const cartBtn = DOM.select('#cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    
    // Mobile cart button
    const mobileCartBtn = DOM.select('#mobileCartBtn');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
});

console.log('Cart system initialized');