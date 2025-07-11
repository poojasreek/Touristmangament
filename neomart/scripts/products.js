// Products Page JavaScript for NeoMart

import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit, where, startAfter } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { DOM, StringUtils, debounce } from './utils.js';
import cartManager from './cart.js';

class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentSort = 'name';
        this.currentView = 'grid';
        this.filters = {
            search: '',
            category: 'all',
            priceRange: 'all',
            rating: 'all'
        };
        this.categories = new Set();
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true
            });
        }
        
        // Load products
        this.loadProducts();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize filters
        this.initFilters();
    }
    
    // Load products from Firebase or use mock data
    async loadProducts() {
        try {
            this.showLoading();
            
            // Try to load from Firebase first
            try {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    this.products = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                } else {
                    // Use mock data if no products in Firebase
                    this.products = this.getMockProducts();
                }
            } catch (error) {
                console.log('Using mock data for products');
                this.products = this.getMockProducts();
            }
            
            // Extract categories
            this.extractCategories();
            
            // Initialize filters UI
            this.renderCategoryFilters();
            
            // Apply initial filtering
            this.applyFilters();
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.hideLoading();
            this.showError('Failed to load products. Please try again.');
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
                description: 'High-quality wireless headphones with noise cancellation technology.',
                featured: true,
                inStock: true,
                stock: 15,
                createdAt: new Date('2024-01-15')
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
                description: 'Advanced fitness tracking with heart rate monitor and GPS.',
                featured: true,
                inStock: true,
                stock: 23,
                createdAt: new Date('2024-01-10')
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
                description: 'Sleek LED desk lamp with adjustable brightness and modern design.',
                featured: true,
                inStock: true,
                stock: 8,
                createdAt: new Date('2024-01-08')
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
                description: 'Comfortable organic cotton t-shirt available in various colors.',
                featured: true,
                inStock: true,
                stock: 45,
                createdAt: new Date('2024-01-05')
            },
            {
                id: 'prod5',
                name: 'Professional Camera Lens',
                price: 799.99,
                originalPrice: 999.99,
                image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
                category: 'Electronics',
                rating: 4.9,
                reviews: 67,
                description: 'Professional-grade camera lens for stunning photography.',
                featured: false,
                inStock: true,
                stock: 12,
                createdAt: new Date('2024-01-03')
            },
            {
                id: 'prod6',
                name: 'Ergonomic Office Chair',
                price: 299.99,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                category: 'Home & Office',
                rating: 4.4,
                reviews: 134,
                description: 'Comfortable ergonomic office chair with lumbar support.',
                featured: false,
                inStock: true,
                stock: 7,
                createdAt: new Date('2024-01-01')
            },
            {
                id: 'prod7',
                name: 'Wireless Gaming Mouse',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
                category: 'Electronics',
                rating: 4.3,
                reviews: 189,
                description: 'High-precision wireless gaming mouse with RGB lighting.',
                featured: false,
                inStock: true,
                stock: 31,
                createdAt: new Date('2023-12-28')
            },
            {
                id: 'prod8',
                name: 'Casual Denim Jacket',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
                category: 'Clothing',
                rating: 4.2,
                reviews: 98,
                description: 'Classic denim jacket perfect for casual occasions.',
                featured: false,
                inStock: true,
                stock: 22,
                createdAt: new Date('2023-12-25')
            }
        ];
    }
    
    // Extract unique categories from products
    extractCategories() {
        this.categories.clear();
        this.products.forEach(product => {
            if (product.category) {
                this.categories.add(product.category);
            }
        });
    }
    
    // Render category filters
    renderCategoryFilters() {
        const container = DOM.select('#categoryFilters');
        if (!container) return;
        
        container.innerHTML = `
            <label class="flex items-center">
                <input type="checkbox" value="all" class="category-filter text-navy-600 rounded" checked>
                <span class="ml-2 text-gray-700">All Categories</span>
            </label>
        `;
        
        this.categories.forEach(category => {
            const label = DOM.create('label', {
                className: 'flex items-center'
            }, `
                <input type="checkbox" value="${category}" class="category-filter text-navy-600 rounded">
                <span class="ml-2 text-gray-700">${category}</span>
            `);
            
            container.appendChild(label);
        });
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Search input
        const searchInput = DOM.select('#searchInput');
        if (searchInput) {
            const debouncedSearch = debounce((value) => {
                this.filters.search = value.toLowerCase();
                this.applyFilters();
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
        
        // Sort select
        const sortSelect = DOM.select('#sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }
        
        // View toggle buttons
        const gridView = DOM.select('#gridView');
        const listView = DOM.select('#listView');
        
        if (gridView) {
            gridView.addEventListener('click', () => {
                this.setView('grid');
            });
        }
        
        if (listView) {
            listView.addEventListener('click', () => {
                this.setView('list');
            });
        }
        
        // Clear filters button
        const clearFilters = DOM.select('#clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        // Mobile menu toggle
        const mobileMenuBtn = DOM.select('#mobileMenuBtn');
        const mobileMenu = DOM.select('#mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                DOM.toggleClass(mobileMenu, 'hidden');
            });
        }
    }
    
    // Initialize filter event listeners
    initFilters() {
        // Category filters
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('category-filter')) {
                this.handleCategoryFilter(e.target);
            }
        });
        
        // Price range filters
        document.addEventListener('change', (e) => {
            if (e.target.name === 'priceRange') {
                this.filters.priceRange = e.target.value;
                this.applyFilters();
            }
        });
        
        // Rating filters
        document.addEventListener('change', (e) => {
            if (e.target.name === 'rating') {
                this.filters.rating = e.target.value;
                this.applyFilters();
            }
        });
    }
    
    // Handle category filter changes
    handleCategoryFilter(checkbox) {
        const allCheckbox = DOM.select('input[value="all"].category-filter');
        const categoryCheckboxes = DOM.selectAll('input.category-filter:not([value="all"])');
        
        if (checkbox.value === 'all') {
            if (checkbox.checked) {
                // Uncheck all other categories
                categoryCheckboxes.forEach(cb => cb.checked = false);
                this.filters.category = 'all';
            }
        } else {
            // Uncheck "All" if a specific category is selected
            if (checkbox.checked) {
                allCheckbox.checked = false;
            }
            
            // Check if any category is selected
            const anySelected = Array.from(categoryCheckboxes).some(cb => cb.checked);
            if (!anySelected) {
                allCheckbox.checked = true;
                this.filters.category = 'all';
            } else {
                const selectedCategories = Array.from(categoryCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                this.filters.category = selectedCategories;
            }
        }
        
        this.applyFilters();
    }
    
    // Apply all filters
    applyFilters() {
        let filtered = [...this.products];
        
        // Apply search filter
        if (this.filters.search) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.filters.search) ||
                product.description.toLowerCase().includes(this.filters.search) ||
                product.category.toLowerCase().includes(this.filters.search)
            );
        }
        
        // Apply category filter
        if (this.filters.category !== 'all') {
            if (Array.isArray(this.filters.category)) {
                filtered = filtered.filter(product => 
                    this.filters.category.includes(product.category)
                );
            } else {
                filtered = filtered.filter(product => 
                    product.category === this.filters.category
                );
            }
        }
        
        // Apply price range filter
        if (this.filters.priceRange !== 'all') {
            const [min, max] = this.filters.priceRange.split('-').map(Number);
            filtered = filtered.filter(product => {
                if (max === 999) {
                    return product.price >= min;
                }
                return product.price >= min && product.price <= max;
            });
        }
        
        // Apply rating filter
        if (this.filters.rating !== 'all') {
            const minRating = parseFloat(this.filters.rating);
            filtered = filtered.filter(product => product.rating >= minRating);
        }
        
        // Apply sorting
        this.sortProducts(filtered);
        
        this.filteredProducts = filtered;
        this.currentPage = 1;
        
        // Update UI
        this.updateResultsCount();
        this.renderProducts();
        this.renderPagination();
    }
    
    // Sort products
    sortProducts(products) {
        switch (this.currentSort) {
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
    }
    
    // Set view mode
    setView(view) {
        this.currentView = view;
        
        const gridBtn = DOM.select('#gridView');
        const listBtn = DOM.select('#listView');
        
        if (view === 'grid') {
            DOM.addClass(gridBtn, 'bg-navy-100');
            DOM.removeClass(listBtn, 'bg-navy-100');
        } else {
            DOM.addClass(listBtn, 'bg-navy-100');
            DOM.removeClass(gridBtn, 'bg-navy-100');
        }
        
        this.renderProducts();
    }
    
    // Clear all filters
    clearAllFilters() {
        // Reset search
        const searchInput = DOM.select('#searchInput');
        if (searchInput) searchInput.value = '';
        
        // Reset category filters
        const allCheckbox = DOM.select('input[value="all"].category-filter');
        const categoryCheckboxes = DOM.selectAll('input.category-filter:not([value="all"])');
        
        if (allCheckbox) allCheckbox.checked = true;
        categoryCheckboxes.forEach(cb => cb.checked = false);
        
        // Reset price range
        const priceRadios = DOM.selectAll('input[name="priceRange"]');
        priceRadios.forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        
        // Reset rating
        const ratingRadios = DOM.selectAll('input[name="rating"]');
        ratingRadios.forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        
        // Reset sort
        const sortSelect = DOM.select('#sortSelect');
        if (sortSelect) sortSelect.value = 'name';
        
        // Reset filters object
        this.filters = {
            search: '',
            category: 'all',
            priceRange: 'all',
            rating: 'all'
        };
        this.currentSort = 'name';
        
        this.applyFilters();
    }
    
    // Update results count
    updateResultsCount() {
        const resultsCount = DOM.select('#resultsCount');
        if (resultsCount) {
            const total = this.filteredProducts.length;
            const start = (this.currentPage - 1) * this.productsPerPage + 1;
            const end = Math.min(start + this.productsPerPage - 1, total);
            
            if (total === 0) {
                resultsCount.textContent = 'No products found';
            } else {
                resultsCount.textContent = `Showing ${start}-${end} of ${total} products`;
            }
        }
    }
    
    // Render products
    renderProducts() {
        const container = DOM.select('#productsGrid');
        const noResults = DOM.select('#noResults');
        
        if (!container) return;
        
        // Show/hide no results message
        if (this.filteredProducts.length === 0) {
            container.style.display = 'none';
            DOM.removeClass(noResults, 'hidden');
            return;
        } else {
            container.style.display = 'grid';
            DOM.addClass(noResults, 'hidden');
        }
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        // Update grid classes based on view
        if (this.currentView === 'grid') {
            container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
        } else {
            container.className = 'space-y-6';
        }
        
        // Clear and render products
        container.innerHTML = '';
        
        pageProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            container.appendChild(productCard);
        });
        
        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Create product card
    createProductCard(product, index) {
        const discountPercent = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        const cardClass = this.currentView === 'grid' ? 
            'product-card group cursor-pointer' : 
            'flex bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300';
        
        const card = DOM.create('div', {
            className: cardClass,
            dataset: { productId: product.id },
            'data-aos': 'fade-up',
            'data-aos-delay': index * 100
        });
        
        if (this.currentView === 'grid') {
            card.innerHTML = this.getGridCardHTML(product, discountPercent);
        } else {
            card.innerHTML = this.getListCardHTML(product, discountPercent);
        }
        
        // Add click handler for product view
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-action-btn')) {
                this.viewProduct(product.id);
            }
        });
        
        return card;
    }
    
    // Get grid card HTML
    getGridCardHTML(product, discountPercent) {
        return `
            <div class="relative overflow-hidden rounded-xl bg-white shadow-lg">
                <div class="relative h-48 overflow-hidden">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                         loading="lazy">
                         
                    ${discountPercent > 0 ? `
                        <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                            -${discountPercent}%
                        </div>
                    ` : ''}
                    
                    <div class="absolute inset-0 bg-navy-800 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div class="flex space-x-3">
                            <button class="product-action-btn bg-white text-navy-800 p-3 rounded-full hover:bg-navy-50 transition-colors" 
                                    onclick="productsPage.addToCart('${product.id}')" title="Add to Cart">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005 16v0a1 1 0 001 1h11M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
                                </svg>
                            </button>
                            <button class="product-action-btn bg-white text-navy-800 p-3 rounded-full hover:bg-navy-50 transition-colors" 
                                    onclick="productsPage.addToWishlist('${product.id}')" title="Add to Wishlist">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="text-sm text-navy-600 font-medium mb-2">${product.category}</div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-navy-600 transition-colors">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-xl font-bold text-navy-800">${StringUtils.formatCurrency(product.price)}</span>
                            ${product.originalPrice ? `
                                <span class="text-sm text-gray-500 line-through">${StringUtils.formatCurrency(product.originalPrice)}</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-1">
                            ${this.createStarRating(product.rating)}
                            <span class="text-sm text-gray-500 ml-1">(${product.reviews})</span>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${product.stock} in stock
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get list card HTML
    getListCardHTML(product, discountPercent) {
        return `
            <div class="w-48 h-48 relative overflow-hidden">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="w-full h-full object-cover"
                     loading="lazy">
                     
                ${discountPercent > 0 ? `
                    <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        -${discountPercent}%
                    </div>
                ` : ''}
            </div>
            
            <div class="flex-1 p-6">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <div class="text-sm text-navy-600 font-medium mb-1">${product.category}</div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">${product.name}</h3>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-navy-800">${StringUtils.formatCurrency(product.price)}</div>
                        ${product.originalPrice ? `
                            <div class="text-sm text-gray-500 line-through">${StringUtils.formatCurrency(product.originalPrice)}</div>
                        ` : ''}
                    </div>
                </div>
                
                <p class="text-gray-600 mb-4">${product.description}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1">
                        ${this.createStarRating(product.rating)}
                        <span class="text-sm text-gray-500 ml-2">(${product.reviews} reviews)</span>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                        <span class="text-sm text-gray-500">${product.stock} in stock</span>
                        <button class="product-action-btn bg-navy-800 text-white px-6 py-2 rounded-lg hover:bg-navy-700 transition-colors"
                                onclick="productsPage.addToCart('${product.id}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
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
                        <linearGradient id="half-star-${rating}">
                            <stop offset="50%" stop-color="currentColor"/>
                            <stop offset="50%" stop-color="#e5e7eb"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#half-star-${rating})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
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
    
    // Render pagination
    renderPagination() {
        const container = DOM.select('#pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                        onclick="productsPage.goToPage(${this.currentPage - 1})">
                    Previous
                </button>
            `;
        }
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            paginationHTML += `
                <button class="px-3 py-2 rounded-lg border transition-colors ${
                    isActive ? 'bg-navy-800 text-white' : 'hover:bg-gray-50'
                }"
                        onclick="productsPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                        onclick="productsPage.goToPage(${this.currentPage + 1})">
                    Next
                </button>
            `;
        }
        
        container.innerHTML = paginationHTML;
    }
    
    // Go to specific page
    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
        
        // Scroll to top of products
        const productsSection = DOM.select('#productsGrid');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Product actions
    async addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
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
        console.log('Add to wishlist:', productId);
        this.showMessage('Added to wishlist!', 'success');
    }
    
    // Loading states
    showLoading() {
        const loadingState = DOM.select('#loadingState');
        const productsGrid = DOM.select('#productsGrid');
        
        if (loadingState) DOM.removeClass(loadingState, 'hidden');
        if (productsGrid) productsGrid.style.display = 'none';
    }
    
    hideLoading() {
        const loadingState = DOM.select('#loadingState');
        const productsGrid = DOM.select('#productsGrid');
        
        if (loadingState) DOM.addClass(loadingState, 'hidden');
        if (productsGrid) productsGrid.style.display = 'grid';
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
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

// Initialize products page
let productsPage;

document.addEventListener('DOMContentLoaded', () => {
    productsPage = new ProductsPage();
    
    // Make it globally available for onclick handlers
    window.productsPage = productsPage;
});

export default ProductsPage;