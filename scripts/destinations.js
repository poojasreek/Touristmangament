// Destinations page functionality

// Extended destinations data
const allDestinations = [
    {
        id: 1,
        name: "Paris",
        location: "France",
        continent: "europe",
        type: "city",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1299,
        rating: 4.8,
        reviews: 2847,
        description: "Experience the romance and elegance of the City of Light with its iconic landmarks, world-class museums, and exquisite cuisine. From the Eiffel Tower to the Louvre, Paris offers an unforgettable journey through art, culture, and history.",
        features: ["Museums", "Architecture", "Cuisine", "Romance"],
        highlights: [
            "Visit the iconic Eiffel Tower",
            "Explore the Louvre Museum",
            "Stroll along the Seine River",
            "Experience Montmartre district"
        ]
    },
    {
        id: 2,
        name: "Tokyo",
        location: "Japan",
        continent: "asia",
        type: "city",
        priceRange: "luxury",
        image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1599,
        rating: 4.9,
        reviews: 3241,
        description: "Discover the perfect blend of ancient traditions and cutting-edge technology in Japan's vibrant capital. From serene temples to bustling districts, Tokyo offers an incredible cultural experience.",
        features: ["Technology", "Culture", "Food", "Shopping"],
        highlights: [
            "Experience traditional temples",
            "Explore modern Shibuya district",
            "Taste authentic sushi",
            "Visit cherry blossom parks"
        ]
    },
    {
        id: 3,
        name: "Bali",
        location: "Indonesia",
        continent: "asia",
        type: "beach",
        priceRange: "budget",
        image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 899,
        rating: 4.7,
        reviews: 1923,
        description: "Relax in tropical paradise with stunning beaches, lush rice terraces, and rich cultural heritage. Bali offers the perfect combination of relaxation and adventure.",
        features: ["Beaches", "Culture", "Temples", "Nature"],
        highlights: [
            "Relax on pristine beaches",
            "Visit ancient temples",
            "Explore rice terraces",
            "Experience local culture"
        ]
    },
    {
        id: 4,
        name: "Santorini",
        location: "Greece",
        continent: "europe",
        type: "beach",
        priceRange: "luxury",
        image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1199,
        rating: 4.6,
        reviews: 1567,
        description: "Marvel at breathtaking sunsets and iconic white-washed buildings overlooking the Aegean Sea. Santorini is the epitome of Greek island beauty.",
        features: ["Sunsets", "Architecture", "Wine", "Romance"],
        highlights: [
            "Watch stunning sunsets in Oia",
            "Explore volcanic beaches",
            "Taste local wines",
            "Visit traditional villages"
        ]
    },
    {
        id: 5,
        name: "Maldives",
        location: "Indian Ocean",
        continent: "asia",
        type: "beach",
        priceRange: "luxury",
        image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 2299,
        rating: 4.9,
        reviews: 892,
        description: "Escape to luxury overwater bungalows and pristine coral reefs in this tropical paradise. The Maldives offers unparalleled luxury and natural beauty.",
        features: ["Luxury", "Diving", "Privacy", "Beaches"],
        highlights: [
            "Stay in overwater bungalows",
            "Snorkel with marine life",
            "Enjoy private beaches",
            "Experience world-class spas"
        ]
    },
    {
        id: 6,
        name: "Iceland",
        location: "Nordic",
        continent: "europe",
        type: "adventure",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1799,
        rating: 4.8,
        reviews: 1234,
        description: "Witness the Northern Lights, geysers, and dramatic landscapes in the land of fire and ice. Iceland offers unique natural phenomena and breathtaking scenery.",
        features: ["Northern Lights", "Geysers", "Glaciers", "Adventure"],
        highlights: [
            "See the Northern Lights",
            "Visit geysers and hot springs",
            "Explore ice caves",
            "Drive the Ring Road"
        ]
    },
    {
        id: 7,
        name: "Dubai",
        location: "UAE",
        continent: "asia",
        type: "city",
        priceRange: "luxury",
        image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1899,
        rating: 4.5,
        reviews: 2156,
        description: "Experience luxury and innovation in this modern desert metropolis. Dubai combines traditional Arabian culture with futuristic architecture and world-class shopping.",
        features: ["Luxury", "Shopping", "Architecture", "Desert"],
        highlights: [
            "Visit Burj Khalifa",
            "Shop at Dubai Mall",
            "Experience desert safari",
            "Enjoy luxury resorts"
        ]
    },
    {
        id: 8,
        name: "New York",
        location: "USA",
        continent: "north-america",
        type: "city",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1399,
        rating: 4.4,
        reviews: 3567,
        description: "Discover the city that never sleeps with its iconic skyline, Broadway shows, and diverse neighborhoods. New York offers endless entertainment and cultural experiences.",
        features: ["Broadway", "Museums", "Food", "Nightlife"],
        highlights: [
            "See a Broadway show",
            "Visit Central Park",
            "Explore diverse neighborhoods",
            "Experience world-class dining"
        ]
    },
    {
        id: 9,
        name: "Machu Picchu",
        location: "Peru",
        continent: "south-america",
        type: "cultural",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1199,
        rating: 4.9,
        reviews: 1876,
        description: "Explore the ancient Incan citadel high in the Andes Mountains. Machu Picchu is one of the world's most spectacular archaeological sites.",
        features: ["History", "Hiking", "Culture", "Mountains"],
        highlights: [
            "Hike the Inca Trail",
            "Explore ancient ruins",
            "Experience Andean culture",
            "See breathtaking mountain views"
        ]
    },
    {
        id: 10,
        name: "Safari Kenya",
        location: "Kenya",
        continent: "africa",
        type: "adventure",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1699,
        rating: 4.7,
        reviews: 1432,
        description: "Witness the Great Migration and incredible wildlife in Kenya's world-famous national parks. Experience the magic of African safari.",
        features: ["Wildlife", "Safari", "Nature", "Photography"],
        highlights: [
            "See the Big Five",
            "Witness Great Migration",
            "Visit Maasai villages",
            "Experience game drives"
        ]
    },
    {
        id: 11,
        name: "Swiss Alps",
        location: "Switzerland",
        continent: "europe",
        type: "mountain",
        priceRange: "luxury",
        image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 2199,
        rating: 4.8,
        reviews: 987,
        description: "Experience pristine mountain landscapes, charming villages, and world-class skiing in the heart of the Alps.",
        features: ["Mountains", "Skiing", "Villages", "Nature"],
        highlights: [
            "Ski world-class slopes",
            "Take scenic train rides",
            "Visit charming villages",
            "Enjoy mountain hiking"
        ]
    },
    {
        id: 12,
        name: "Great Barrier Reef",
        location: "Australia",
        continent: "oceania",
        type: "adventure",
        priceRange: "mid-range",
        image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1799,
        rating: 4.6,
        reviews: 1654,
        description: "Dive into the world's largest coral reef system and discover incredible marine biodiversity in this UNESCO World Heritage site.",
        features: ["Diving", "Marine Life", "Coral", "Adventure"],
        highlights: [
            "Scuba dive coral reefs",
            "See tropical fish",
            "Take boat tours",
            "Experience marine parks"
        ]
    }
];

class DestinationsPage {
    constructor() {
        this.searchInput = document.getElementById('destination-search');
        this.searchBtn = document.getElementById('search-btn');
        this.continentFilter = document.getElementById('continent-filter');
        this.priceFilter = document.getElementById('price-filter');
        this.typeFilter = document.getElementById('type-filter');
        this.destinationsGrid = document.getElementById('destinations-grid');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('no-results');
        this.modal = new Modal('destination-modal');
        
        this.currentDestinations = [...allDestinations];
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupSearch();
        this.loadDestinations();
        this.handleURLParams();
    }

    setupFilters() {
        [this.continentFilter, this.priceFilter, this.typeFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    setupSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', Utils.debounce(() => {
                this.applyFilters();
            }, 300));
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.applyFilters());
        }
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        const destinationId = urlParams.get('destination');

        if (searchQuery && this.searchInput) {
            this.searchInput.value = searchQuery;
            this.applyFilters();
        }

        if (destinationId) {
            const destination = allDestinations.find(d => d.id === parseInt(destinationId));
            if (destination) {
                setTimeout(() => this.showDestinationModal(destination), 500);
            }
        }
    }

    applyFilters() {
        const searchQuery = this.searchInput?.value.toLowerCase() || '';
        const continent = this.continentFilter?.value || '';
        const priceRange = this.priceFilter?.value || '';
        const type = this.typeFilter?.value || '';

        this.currentDestinations = allDestinations.filter(destination => {
            const matchesSearch = !searchQuery || 
                destination.name.toLowerCase().includes(searchQuery) ||
                destination.location.toLowerCase().includes(searchQuery) ||
                destination.description.toLowerCase().includes(searchQuery);
            
            const matchesContinent = !continent || destination.continent === continent;
            const matchesPrice = !priceRange || destination.priceRange === priceRange;
            const matchesType = !type || destination.type === type;

            return matchesSearch && matchesContinent && matchesPrice && matchesType;
        });

        this.loadDestinations();
    }

    async loadDestinations() {
        if (!this.destinationsGrid) return;

        this.showLoading();
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));

        this.hideLoading();

        if (this.currentDestinations.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();
        this.renderDestinations();
    }

    renderDestinations() {
        this.destinationsGrid.innerHTML = '';
        
        this.currentDestinations.forEach((destination, index) => {
            const card = this.createDestinationCard(destination);
            card.style.animationDelay = `${index * 0.1}s`;
            this.destinationsGrid.appendChild(card);
        });
    }

    createDestinationCard(destination) {
        const card = document.createElement('div');
        card.className = 'destination-card';
        
        const priceLabel = this.getPriceLabel(destination.priceRange);
        const badgeColor = this.getBadgeColor(destination.priceRange);
        
        card.innerHTML = `
            <div class="destination-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
                <div class="destination-badge" style="background: ${badgeColor}">${destination.type}</div>
                <div class="destination-price-badge">$${destination.price}</div>
            </div>
            <div class="destination-content">
                <div class="destination-header">
                    <div>
                        <h3 class="destination-title">${destination.name}</h3>
                        <div class="destination-location">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${destination.location}
                        </div>
                    </div>
                    <div class="destination-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${destination.rating}
                    </div>
                </div>
                <p class="destination-description">${destination.description}</p>
                <div class="destination-features">
                    ${destination.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="destination-footer">
                    <div class="destination-price">
                        $${destination.price}
                        <span class="price-label">/ ${priceLabel}</span>
                    </div>
                    <button class="view-details-btn" onclick="destinationsPage.showDestinationModal(${JSON.stringify(destination).replace(/"/g, '&quot;')})">
                        View Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    showDestinationModal(destination) {
        const modalBody = document.getElementById('modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="modal-destination-image">
            <div class="modal-destination-header">
                <div>
                    <h2 class="modal-destination-title">${destination.name}</h2>
                    <div class="modal-destination-location">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${destination.location}
                    </div>
                </div>
                <div class="modal-destination-price">
                    <span class="modal-price-amount">$${destination.price}</span>
                    <span class="modal-price-label">per person</span>
                </div>
            </div>
            <div class="modal-destination-rating">
                <div class="modal-rating-stars">
                    ${this.generateStars(destination.rating)}
                </div>
                <span class="modal-rating-text">${destination.rating} (${destination.reviews} reviews)</span>
            </div>
            <p class="modal-destination-description">${destination.description}</p>
            <div class="modal-destination-features">
                <h3>What's Included</h3>
                <div class="modal-features-grid">
                    ${destination.highlights.map(highlight => `
                        <div class="modal-feature-item">
                            <svg class="modal-feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22,4 12,14.01 9,11.01"/>
                            </svg>
                            <span>${highlight}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="destinationsPage.modal.close()">Close</button>
                <button class="btn btn-primary" onclick="window.location.href='booking.html?destination=${destination.name.toLowerCase()}'">Book Now</button>
            </div>
        `;

        this.modal.open();
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        }

        if (hasHalfStar) {
            stars += '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill-opacity="0.5"/></svg>';
        }

        return stars;
    }

    getPriceLabel(priceRange) {
        const labels = {
            'budget': 'person',
            'mid-range': 'person',
            'luxury': 'person'
        };
        return labels[priceRange] || 'person';
    }

    getBadgeColor(priceRange) {
        const colors = {
            'budget': 'rgba(34, 197, 94, 0.9)',
            'mid-range': 'rgba(59, 130, 246, 0.9)',
            'luxury': 'rgba(168, 85, 247, 0.9)'
        };
        return colors[priceRange] || 'rgba(59, 130, 246, 0.9)';
    }

    showLoading() {
        if (this.loading) this.loading.style.display = 'block';
        if (this.destinationsGrid) this.destinationsGrid.style.display = 'none';
        if (this.noResults) this.noResults.style.display = 'none';
    }

    hideLoading() {
        if (this.loading) this.loading.style.display = 'none';
        if (this.destinationsGrid) this.destinationsGrid.style.display = 'grid';
    }

    showNoResults() {
        if (this.noResults) this.noResults.style.display = 'block';
        if (this.destinationsGrid) this.destinationsGrid.style.display = 'none';
    }

    hideNoResults() {
        if (this.noResults) this.noResults.style.display = 'none';
    }
}

// Initialize destinations page
let destinationsPage;
document.addEventListener('DOMContentLoaded', () => {
    destinationsPage = new DestinationsPage();
});