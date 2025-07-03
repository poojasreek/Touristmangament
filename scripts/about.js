// About page functionality

class AboutPage {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupScrollAnimations();
        this.setupTeamInteractions();
    }

    setupContactForm() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit();
        });

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });

            input.addEventListener('input', () => {
                FormValidator.clearError(input);
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !FormValidator.validateRequired(value)) {
            FormValidator.showError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email' && value && !FormValidator.validateEmail(value)) {
            FormValidator.showError(input, 'Please enter a valid email address');
            return false;
        }

        FormValidator.clearError(input);
        return true;
    }

    async handleContactSubmit() {
        const messageElement = document.getElementById('contact-message-result');
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        
        // Validate form
        if (!FormValidator.validateForm(this.contactForm)) {
            this.showContactMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get form data
            const formData = new FormData(this.contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            // In a real application, you would send this data to your server
            console.log('Contact form submission:', contactData);
            
            this.showContactMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            this.contactForm.reset();
            
            // Show notification
            Utils.showNotification('Message sent successfully!', 'success');
            
        } catch (error) {
            console.error('Contact form error:', error);
            this.showContactMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showContactMessage(message, type) {
        const messageElement = document.getElementById('contact-message-result');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `form-message ${type}`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageElement.className = 'form-message';
            }, 5000);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Add stagger effect for team members and value cards
                    if (entry.target.classList.contains('team-member') || 
                        entry.target.classList.contains('value-card')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.about-text, .about-image, .mv-card, .team-member, .value-card, .contact-item'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
    }

    setupTeamInteractions() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                this.highlightTeamMember(member);
            });

            member.addEventListener('mouseleave', () => {
                this.resetTeamMembers();
            });
        });
    }

    highlightTeamMember(activeMember) {
        const allMembers = document.querySelectorAll('.team-member');
        
        allMembers.forEach(member => {
            if (member !== activeMember) {
                member.style.opacity = '0.6';
                member.style.transform = 'scale(0.95)';
            } else {
                member.style.transform = 'scale(1.05) translateY(-10px)';
            }
        });
    }

    resetTeamMembers() {
        const allMembers = document.querySelectorAll('.team-member');
        
        allMembers.forEach(member => {
            member.style.opacity = '';
            member.style.transform = '';
        });
    }
}

// Statistics counter animation
class StatsCounter {
    constructor() {
        this.stats = [
            { element: '.stat-experience', target: 9, suffix: '+', label: 'Years Experience' },
            { element: '.stat-destinations', target: 500, suffix: '+', label: 'Destinations' },
            { element: '.stat-customers', target: 10000, suffix: '+', label: 'Happy Customers' },
            { element: '.stat-countries', target: 50, suffix: '+', label: 'Countries' }
        ];
        
        this.init();
    }

    init() {
        // Create stats section if it doesn't exist
        this.createStatsSection();
        this.setupCounterAnimation();
    }

    createStatsSection() {
        const aboutContent = document.querySelector('.about-content');
        if (!aboutContent) return;

        const statsSection = document.createElement('div');
        statsSection.className = 'stats-section';
        statsSection.innerHTML = `
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number stat-experience">0</span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number stat-destinations">0</span>
                        <span class="stat-label">Destinations</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number stat-customers">0</span>
                        <span class="stat-label">Happy Customers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number stat-countries">0</span>
                        <span class="stat-label">Countries</span>
                    </div>
                </div>
            </div>
        `;

        // Add CSS for stats section
        const style = document.createElement('style');
        style.textContent = `
            .stats-section {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 4rem 0;
                margin: 2rem 0;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                text-align: center;
            }
            
            .stat-item {
                padding: 1rem;
            }
            
            .stat-number {
                display: block;
                font-size: 3rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                color: #fbbf24;
            }
            
            .stat-label {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            @media (max-width: 768px) {
                .stats-section {
                    padding: 3rem 0;
                }
                
                .stat-number {
                    font-size: 2.5rem;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);

        aboutContent.appendChild(statsSection);
    }

    setupCounterAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (!element) return;

            this.animateNumber(element, stat.target, stat.suffix);
        });
    }

    animateNumber(element, target, suffix = '') {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }
}

// Initialize about page functionality
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
    new StatsCounter();
});