// Home Page JavaScript for NeoMart

import { db } from './firebase-config.js';
import { collection, getDocs, query, limit, orderBy, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { DOM, StringUtils, Animation, debounce } from './utils.js';
import cartManager from './cart.js';

class HomePage {
    constructor() {
        this.featuredProducts = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
        
        // Load featured products
        this.loadFeaturedProducts();
        
        // Initialize interactive elements
        this.initInteractiveElements();
        
        // Initialize scroll effects
        this.initScrollEffects();
        
        // Initialize newsletter form
        this.initNewsletterForm();
        
        // Initialize hero buttons
        this.initHeroButtons();
    }
    
    // Load featured products from Firebase or mock data
    async loadFeaturedProducts() {
        try {
            this.showProductsLoading();
            
            // Try to load from Firebase first
            try {
                const productsRef = collection(db, 'products');
                const q = query(
                    productsRef, 
                    where('featured', '==', true),
                    orderBy('createdAt', 'desc'),
                    limit(8)
                );
                
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    this.featuredProducts = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                } else {
                    // Use mock data if no products in Firebase
                    this.featuredProducts = this.getMockProducts();
                }
            } catch (error) {
                console.log('Using mock data for featured products');
                this.featuredProducts = this.getMockProducts();
            }
            
            this.renderFeaturedProducts();
            this.hideProductsLoading();
            
        } catch (error) {
            console.error('Error loading featured products:', error);
            this.hideProductsLoading();
            this.showProductsError();
        }
    }
    
    // Get mock products for demo
    getMockProducts() {
        return [
            {
                id: 'prod1',
                name: 'Premium Wireless Headphones',
                price: 299.99,
                originalPrice: 399.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                category: 'Electronics',
                rating: 4.8,
                reviews: 124,
                description: 'High-quality wireless headphones with noise cancellation.',
                featured: true,
                inStock: true,
                stock: 15
            },
            {
                id: 'prod2',
                name: 'Smart Fitness Watch',
                price: 199.99,
                originalPrice: 249.99,
                image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
                category: 'Wearables',
                rating: 4.6,
                reviews: 89,
                description: 'Advanced fitness tracking with heart rate monitor.',
                featured: true,
                inStock: true,
                stock: 23
            },
            {
                id: 'prod3',
                name: 'Minimalist Desk Lamp',
                price: 89.99,
                originalPrice: 119.99,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                category: 'Home & Office',
                rating: 4.7,
                reviews: 56,
                description: 'Sleek LED desk lamp with adjustable brightness.',
                featured: true,
                inStock: true,
                stock: 8
            },
            {
                id: 'prod4',
                name: 'Organic Cotton T-Shirt',
                price: 34.99,
                originalPrice: 49.99,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
                category: 'Clothing',
                rating: 4.5,
                reviews: 203,
                description: 'Comfortable organic cotton t-shirt in various colors.',
                featured: true,
                inStock: true,
                stock: 45
            }
        ];
    }
    
    // Render featured products
    renderFeaturedProducts() {
        const container = DOM.select('#featuredProducts');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.featuredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            container.appendChild(productCard);
        });
        
        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Create product card element
    createProductCard(product, index) {
        const discountPercent = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        const card = DOM.create('div', {
            className: 'product-card-featured group cursor-pointer',
            dataset: { productId: product.id },
            'data-aos': 'fade-up',
            'data-aos-delay': index * 100
        });
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image-featured"
                     loading="lazy">
                     
                ${discountPercent > 0 ? `
                    <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        -${discountPercent}%
                    </div>
                ` : ''}
                
                <div class="product-overlay">
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="homePage.addToCart('${product.id}')" title="Add to Cart">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005 16v0a1 1 0 001 1h11M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                        </button>
                        <button class="product-action-btn" onclick="homePage.viewProduct('${product.id}')" title="Quick View">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button class="product-action-btn" onclick="homePage.addToWishlist('${product.id}')" title="Add to Wishlist">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="product-info-featured">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title-featured">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-price-container">
                    <div>
                        <span class="product-price-featured">${StringUtils.formatCurrency(product.price)}</span>
                        ${product.originalPrice ? `
                            <span class="product-original-price">${StringUtils.formatCurrency(product.originalPrice)}</span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="product-rating-featured">
                    <div class="rating-stars">
                        ${this.createStarRating(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
            </div>
        `;
        
        // Add click handler for product view
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on action buttons
            if (!e.target.closest('.product-action-btn')) {
                this.viewProduct(product.id);
            }
        });
        
        return card;
    }
    
    // Create star rating HTML
    createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += `
                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            `;
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += `
                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="half-star">
                            <stop offset="50%" stop-color="currentColor"/>
                            <stop offset="50%" stop-color="#e5e7eb"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            `;
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += `
                <svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            `;
        }
        
        return starsHTML;
    }
    
    // Product actions
    async addToCart(productId) {
        const product = this.featuredProducts.find(p => p.id === productId);
        if (!product) return;
        
        try {
            await cartManager.addItem(product, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }
    
    viewProduct(productId) {
        window.location.href = `product-detail.html?id=${productId}`;
    }
    
    addToWishlist(productId) {
        // Wishlist functionality would be implemented here
        console.log('Add to wishlist:', productId);
        this.showMessage('Added to wishlist!', 'success');
    }
    
    // Initialize interactive elements
    initInteractiveElements() {
        // Mobile menu toggle
        const mobileMenuBtn = DOM.select('#mobileMenuBtn');
        const mobileMenu = DOM.select('#mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                DOM.toggleClass(mobileMenu, 'hidden');
            });
        }
        
        // Smooth scroll for anchor links
        const anchorLinks = DOM.selectAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = DOM.select(`#${targetId}`);
                
                if (target) {
                    Animation.scrollTo(target, 80);
                }
            });
        });
    }
    
    // Initialize scroll effects
    initScrollEffects() {
        const navbar = DOM.select('#navbar');
        
        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                DOM.addClass(navbar, 'scrolled');
            } else {
                DOM.removeClass(navbar, 'scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // Initialize newsletter form
    initNewsletterForm() {
        const form = DOM.select('#newsletterForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                this.showMessage('Please enter your email address', 'error');
                return;
            }
            
            if (!email.includes('@')) {
                this.showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate newsletter subscription
            this.showMessage('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }
    
    // Initialize hero buttons
    initHeroButtons() {
        const shopNowBtn = DOM.select('.hero-buttons button:first-child');
        const exploreBtn = DOM.select('.hero-buttons button:last-child');
        
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                const productsSection = DOM.select('#featuredProducts');
                if (productsSection) {
                    Animation.scrollTo(productsSection.parentElement, 80);
                }
            });
        }
    }
    
    // Loading states
    showProductsLoading() {
        const container = DOM.select('#featuredProducts');
        if (!container) return;
        
        container.innerHTML = `
            <div class="col-span-full flex items-center justify-center py-12">
                <div class="spinner"></div>
                <span class="ml-3 text-lg text-gray-600">Loading featured products...</span>
            </div>
        `;
    }
    
    hideProductsLoading() {
        // Loading will be replaced by products
    }
    
    showProductsError() {
        const container = DOM.select('#featuredProducts');
        if (!container) return;
        
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-500 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Unable to load products</h3>
                <p class="text-gray-600 mb-4">Please check your connection and try again</p>
                <button onclick="homePage.loadFeaturedProducts()" class="btn btn-primary">
                    Try Again
                </button>
            </div>
        `;
    }
    
    // Show messages
    showMessage(message, type = 'info') {
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
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
}

// Initialize home page when DOM is loaded
let homePage;

document.addEventListener('DOMContentLoaded', () => {
    homePage = new HomePage();
    
    // Make it globally available for onclick handlers
    window.homePage = homePage;
});

export default HomePage;