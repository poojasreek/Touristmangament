// Booking page functionality

class BookingPage {
    constructor() {
        this.form = document.getElementById('booking-form');
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.basePrice = 0;
        this.servicesPrice = 0;
        
        this.init();
    }

    init() {
        this.setupFormSteps();
        this.setupCounters();
        this.setupDateValidation();
        this.setupServiceSelection();
        this.setupPriceCalculation();
        this.setupFormSubmission();
        this.handleURLParams();
    }

    setupFormSteps() {
        // Next step buttons
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        // Previous step buttons
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Progress indicator clicks
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.addEventListener('click', () => {
                if (index + 1 <= this.currentStep) {
                    this.goToStep(index + 1);
                }
            });
        });
    }

    setupCounters() {
        document.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const target = btn.dataset.target;
                const input = document.getElementById(target);
                
                if (!input) return;

                let value = parseInt(input.value);
                const min = parseInt(input.min);
                const max = parseInt(input.max);

                if (action === 'increase' && value < max) {
                    value++;
                } else if (action === 'decrease' && value > min) {
                    value--;
                }

                input.value = value;
                this.updatePricing();
            });
        });
    }

    setupDateValidation() {
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');

        if (checkInInput && checkOutInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            checkInInput.min = today;
            checkOutInput.min = today;

            checkInInput.addEventListener('change', () => {
                const checkInDate = new Date(checkInInput.value);
                const nextDay = new Date(checkInDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                checkOutInput.min = nextDay.toISOString().split('T')[0];
                
                if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                    checkOutInput.value = nextDay.toISOString().split('T')[0];
                }
                
                this.updatePricing();
            });

            checkOutInput.addEventListener('change', () => {
                this.updatePricing();
            });
        }
    }

    setupServiceSelection() {
        document.querySelectorAll('input[name="services"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePricing();
            });
        });
    }

    setupPriceCalculation() {
        // Initial price calculation
        this.updatePricing();

        // Listen for destination changes
        const destinationSelect = document.getElementById('destination');
        if (destinationSelect) {
            destinationSelect.addEventListener('change', () => {
                this.updatePricing();
            });
        }
    }

    setupFormSubmission() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const destination = urlParams.get('destination');
        
        if (destination) {
            const destinationSelect = document.getElementById('destination');
            if (destinationSelect) {
                // Try to find matching destination
                const options = destinationSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value.toLowerCase().includes(destination.toLowerCase())) {
                        option.selected = true;
                        this.updatePricing();
                    }
                });
            }
        }
    }

    nextStep() {
        if (this.validateCurrentStep() && this.currentStep < this.totalSteps) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.updateStepDisplay();
            
            if (this.currentStep === this.totalSteps) {
                this.generateBookingSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps && step <= this.currentStep) {
            this.currentStep = step;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update progress indicator
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Scroll to top of form
        document.querySelector('.booking-form-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return false;

        const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            FormValidator.clearError(input);
            
            if (!FormValidator.validateRequired(input.value)) {
                FormValidator.showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !FormValidator.validateEmail(input.value)) {
                FormValidator.showError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (input.type === 'tel' && !FormValidator.validatePhone(input.value)) {
                FormValidator.showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        });

        // Additional validation for step 1
        if (this.currentStep === 1) {
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            
            if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
                FormValidator.showError(document.getElementById('check-out'), 'Check-out date must be after check-in date');
                isValid = false;
            }
        }

        return isValid;
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData.services) this.formData.services = [];
                if (input.checked && !this.formData.services.includes(input.value)) {
                    this.formData.services.push(input.value);
                } else if (!input.checked) {
                    this.formData.services = this.formData.services.filter(s => s !== input.value);
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    updatePricing() {
        const destination = document.getElementById('destination')?.value;
        const checkIn = document.getElementById('check-in')?.value;
        const checkOut = document.getElementById('check-out')?.value;
        const adults = parseInt(document.getElementById('adults')?.value || 0);
        const children = parseInt(document.getElementById('children')?.value || 0);

        // Calculate base price
        this.basePrice = this.calculateBasePrice(destination, checkIn, checkOut, adults, children);
        
        // Calculate services price
        this.servicesPrice = this.calculateServicesPrice();

        // Update price display
        this.updatePriceDisplay();
    }

    calculateBasePrice(destination, checkIn, checkOut, adults, children) {
        if (!destination || !checkIn || !checkOut) return 0;

        const destinationPrices = {
            'paris': 1299,
            'tokyo': 1599,
            'bali': 899,
            'santorini': 1199,
            'maldives': 2299,
            'iceland': 1799,
            'dubai': 1899,
            'new-york': 1399
        };

        const basePrice = destinationPrices[destination] || 1000;
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalTravelers = adults + (children * 0.7); // Children at 70% price

        return Math.round(basePrice * nights * totalTravelers);
    }

    calculateServicesPrice() {
        const servicePrices = {
            'airport-transfer': 50,
            'travel-insurance': 75,
            'tour-guide': 120,
            'meal-plan': 200
        };

        let total = 0;
        document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
            total += servicePrices[checkbox.value] || 0;
        });

        return total;
    }

    updatePriceDisplay() {
        const basePriceElement = document.getElementById('base-price');
        const servicesPriceElement = document.getElementById('services-price');
        const totalPriceElement = document.getElementById('total-price');

        if (basePriceElement) basePriceElement.textContent = Utils.formatCurrency(this.basePrice);
        if (servicesPriceElement) servicesPriceElement.textContent = Utils.formatCurrency(this.servicesPrice);
        if (totalPriceElement) totalPriceElement.textContent = Utils.formatCurrency(this.basePrice + this.servicesPrice);
    }

    generateBookingSummary() {
        const summaryElement = document.getElementById('booking-summary');
        if (!summaryElement) return;

        this.saveCurrentStepData();

        const checkIn = new Date(this.formData['check-in']);
        const checkOut = new Date(this.formData['check-out']);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        const selectedServices = this.formData.services || [];
        const serviceNames = {
            'airport-transfer': 'Airport Transfer',
            'travel-insurance': 'Travel Insurance',
            'tour-guide': 'Personal Tour Guide',
            'meal-plan': 'All-Inclusive Meals'
        };

        summaryElement.innerHTML = `
            <div class="summary-section">
                <h3>Trip Details</h3>
                <div class="summary-item">
                    <span>Destination:</span>
                    <span>${this.getDestinationName(this.formData.destination)}</span>
                </div>
                <div class="summary-item">
                    <span>Check-in:</span>
                    <span>${Utils.formatDate(checkIn)}</span>
                </div>
                <div class="summary-item">
                    <span>Check-out:</span>
                    <span>${Utils.formatDate(checkOut)}</span>
                </div>
                <div class="summary-item">
                    <span>Duration:</span>
                    <span>${nights} night${nights > 1 ? 's' : ''}</span>
                </div>
                <div class="summary-item">
                    <span>Travelers:</span>
                    <span>${this.formData.adults} adult${this.formData.adults > 1 ? 's' : ''}${this.formData.children > 0 ? `, ${this.formData.children} child${this.formData.children > 1 ? 'ren' : ''}` : ''}</span>
                </div>
            </div>

            <div class="summary-section">
                <h3>Personal Information</h3>
                <div class="summary-item">
                    <span>Name:</span>
                    <span>${this.formData['first-name']} ${this.formData['last-name']}</span>
                </div>
                <div class="summary-item">
                    <span>Email:</span>
                    <span>${this.formData.email}</span>
                </div>
                <div class="summary-item">
                    <span>Phone:</span>
                    <span>${this.formData.phone}</span>
                </div>
            </div>

            ${selectedServices.length > 0 ? `
                <div class="summary-section">
                    <h3>Additional Services</h3>
                    ${selectedServices.map(service => `
                        <div class="summary-item">
                            <span>${serviceNames[service]}</span>
                            <span>Included</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="summary-section">
                <h3>Price Breakdown</h3>
                <div class="summary-item">
                    <span>Base Price:</span>
                    <span>${Utils.formatCurrency(this.basePrice)}</span>
                </div>
                ${this.servicesPrice > 0 ? `
                    <div class="summary-item">
                        <span>Additional Services:</span>
                        <span>${Utils.formatCurrency(this.servicesPrice)}</span>
                    </div>
                ` : ''}
                <div class="summary-item total">
                    <span>Total Amount:</span>
                    <span>${Utils.formatCurrency(this.basePrice + this.servicesPrice)}</span>
                </div>
            </div>
        `;
    }

    getDestinationName(value) {
        const names = {
            'paris': 'Paris, France',
            'tokyo': 'Tokyo, Japan',
            'bali': 'Bali, Indonesia',
            'santorini': 'Santorini, Greece',
            'maldives': 'Maldives',
            'iceland': 'Iceland',
            'dubai': 'Dubai, UAE',
            'new-york': 'New York, USA'
        };
        return names[value] || value;
    }

    async submitBooking() {
        if (!this.validateCurrentStep()) return;

        this.saveCurrentStepData();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate booking reference
            const bookingRef = 'TE' + Date.now().toString().slice(-6);
            
            // Show success modal
            this.showSuccessModal(bookingRef);
            
            // Store booking data (in real app, this would be sent to server)
            localStorage.setItem('lastBooking', JSON.stringify({
                ...this.formData,
                bookingRef,
                totalPrice: this.basePrice + this.servicesPrice,
                bookingDate: new Date().toISOString()
            }));

        } catch (error) {
            Utils.showNotification('Booking failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessModal(bookingRef) {
        const modal = new Modal('success-modal');
        const bookingRefElement = document.getElementById('booking-ref');
        
        if (bookingRefElement) {
            bookingRefElement.textContent = bookingRef;
        }
        
        modal.open();
    }
}

// Initialize booking page
document.addEventListener('DOMContentLoaded', () => {
    new BookingPage();
});