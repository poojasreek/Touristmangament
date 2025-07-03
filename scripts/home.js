// Home page specific functionality

// Sample destinations data
const featuredDestinations = [
    {
        id: 1,
        name: "Paris",
        location: "France",
        image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1299,
        rating: 4.8,
        description: "Experience the romance and elegance of the City of Light with its iconic landmarks and world-class cuisine.",
        badge: "Popular"
    },
    {
        id: 2,
        name: "Tokyo",
        location: "Japan",
        image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1599,
        rating: 4.9,
        description: "Discover the perfect blend of ancient traditions and cutting-edge technology in Japan's vibrant capital.",
        badge: "Trending"
    },
    {
        id: 3,
        name: "Bali",
        location: "Indonesia",
        image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 899,
        rating: 4.7,
        description: "Relax in tropical paradise with stunning beaches, lush rice terraces, and rich cultural heritage.",
        badge: "Best Value"
    },
    {
        id: 4,
        name: "Santorini",
        location: "Greece",
        image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1199,
        rating: 4.6,
        description: "Marvel at breathtaking sunsets and iconic white-washed buildings overlooking the Aegean Sea.",
        badge: "Romantic"
    },
    {
        id: 5,
        name: "Maldives",
        location: "Indian Ocean",
        image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 2299,
        rating: 4.9,
        description: "Escape to luxury overwater bungalows and pristine coral reefs in this tropical paradise.",
        badge: "Luxury"
    },
    {
        id: 6,
        name: "Iceland",
        location: "Nordic",
        image: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1799,
        rating: 4.8,
        description: "Witness the Northern Lights, geysers, and dramatic landscapes in the land of fire and ice.",
        badge: "Adventure"
    }
];

// Search suggestions data
const searchSuggestions = [
    "Paris, France",
    "Tokyo, Japan",
    "Bali, Indonesia",
    "Santorini, Greece",
    "Maldives",
    "Iceland",
    "Dubai, UAE",
    "New York, USA",
    "London, UK",
    "Rome, Italy",
    "Barcelona, Spain",
    "Thailand",
    "Morocco",
    "Egypt",
    "Peru",
    "Nepal"
];

class HomePage {
    constructor() {
        this.searchInput = document.getElementById('hero-search');
        this.searchBtn = document.getElementById('hero-search-btn');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.featuredGrid = document.getElementById('featured-destinations');
        this.newsletterForm = document.getElementById('newsletter-form');
        
        this.init();
    }

    init() {
        this.loadFeaturedDestinations();
        this.setupHeroSearch();
        this.setupNewsletterForm();
        this.animateStats();
    }

    loadFeaturedDestinations() {
        if (!this.featuredGrid) return;

        this.featuredGrid.innerHTML = '';
        
        featuredDestinations.forEach((destination, index) => {
            const card = this.createDestinationCard(destination);
            card.style.animationDelay = `${index * 0.1}s`;
            this.featuredGrid.appendChild(card);
        });
    }

    createDestinationCard(destination) {
        const card = document.createElement('div');
        card.className = 'destination-card fade-in';
        card.innerHTML = `
            <div class="destination-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
                <div class="destination-badge">${destination.badge}</div>
            </div>
            <div class="destination-content">
                <h3 class="destination-title">${destination.name}</h3>
                <div class="destination-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${destination.location}
                </div>
                <p class="destination-description">${destination.description}</p>
                <div class="destination-footer">
                    <div class="destination-price">$${destination.price}</div>
                    <div class="destination-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${destination.rating}
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `destinations.html?destination=${destination.id}`;
        });

        return card;
    }

    setupHeroSearch() {
        if (!this.searchInput) return;

        // Setup search input
        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            this.handleSearchInput(e.target.value);
        }, 300));

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.showSuggestions(this.filterSuggestions(this.searchInput.value));
            }
        });

        this.searchInput.addEventListener('blur', () => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        // Setup search button
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    handleSearchInput(query) {
        if (query.trim().length > 0) {
            const suggestions = this.filterSuggestions(query);
            this.showSuggestions(suggestions);
        } else {
            this.hideSuggestions();
        }
    }

    filterSuggestions(query) {
        return searchSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    showSuggestions(suggestions) {
        if (!this.searchSuggestions || suggestions.length === 0) return;

        this.searchSuggestions.innerHTML = '';
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.addEventListener('click', () => {
                this.searchInput.value = suggestion;
                this.hideSuggestions();
                this.performSearch();
            });
            this.searchSuggestions.appendChild(item);
        });

        this.searchSuggestions.classList.add('active');
    }

    hideSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.classList.remove('active');
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            window.location.href = `destinations.html?search=${encodeURIComponent(query)}`;
        }
    }

    setupNewsletterForm() {
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmit();
        });
    }

    async handleNewsletterSubmit() {
        const emailInput = document.getElementById('newsletter-email');
        const messageElement = document.getElementById('newsletter-message');
        const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');

        if (!emailInput || !FormValidator.validateEmail(emailInput.value)) {
            this.showNewsletterMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNewsletterMessage('Thank you for subscribing! You\'ll receive our latest travel updates.', 'success');
            emailInput.value = '';
        } catch (error) {
            this.showNewsletterMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNewsletterMessage(message, type) {
        const messageElement = document.getElementById('newsletter-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `newsletter-message ${type}`;
            
            setTimeout(() => {
                messageElement.className = 'newsletter-message';
            }, 5000);
        }
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    animateNumber(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.includes('+') ? '+' : '';
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }
}

// Initialize home page functionality
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});