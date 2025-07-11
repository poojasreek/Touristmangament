// Utility Functions for NeoMart

// DOM Utilities
export const DOM = {
    // Select element(s)
    select: (selector) => document.querySelector(selector),
    selectAll: (selector) => document.querySelectorAll(selector),
    
    // Create element with attributes and content
    create: (tag, attributes = {}, content = '') => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },
    
    // Add event listener with cleanup
    on: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
        
        return () => element.removeEventListener(event, handler, options);
    },
    
    // Remove element
    remove: (element) => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },
    
    // Show/hide elements
    show: (element) => {
        element.style.display = '';
        element.removeAttribute('hidden');
    },
    
    hide: (element) => {
        element.style.display = 'none';
        element.setAttribute('hidden', '');
    },
    
    // Toggle visibility
    toggle: (element) => {
        if (element.style.display === 'none' || element.hasAttribute('hidden')) {
            DOM.show(element);
        } else {
            DOM.hide(element);
        }
    },
    
    // Add/remove classes
    addClass: (element, className) => element.classList.add(className),
    removeClass: (element, className) => element.classList.remove(className),
    toggleClass: (element, className) => element.classList.toggle(className),
    hasClass: (element, className) => element.classList.contains(className)
};

// String Utilities
export const StringUtils = {
    // Capitalize first letter
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
    
    // Convert to title case
    titleCase: (str) => str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    
    // Slugify string for URLs
    slugify: (str) => str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    
    // Truncate string with ellipsis
    truncate: (str, length, suffix = '...') => 
        str.length <= length ? str : str.substring(0, length) + suffix,
    
    // Generate random string
    random: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    // Format currency
    formatCurrency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format number with commas
    formatNumber: (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    }
};

// Date Utilities
export const DateUtils = {
    // Format date
    format: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
            .format(new Date(date));
    },
    
    // Get relative time (e.g., "2 hours ago")
    relative: (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    },
    
    // Check if date is today
    isToday: (date) => {
        const today = new Date();
        const checkDate = new Date(date);
        
        return today.toDateString() === checkDate.toDateString();
    }
};

// Validation Utilities
export const Validation = {
    // Email validation
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Phone validation
    phone: (phone) => {
        const re = /^\+?[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    },
    
    // Password strength
    password: (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        
        return {
            isValid: score >= 3,
            score,
            checks,
            strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
        };
    },
    
    // Credit card validation
    creditCard: (number) => {
        const re = /^\d{13,19}$/;
        if (!re.test(number.replace(/\s/g, ''))) return false;
        
        // Luhn algorithm
        const digits = number.replace(/\s/g, '').split('').map(Number);
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    },
    
    // Required field validation
    required: (value) => value !== undefined && value !== null && value.toString().trim() !== '',
    
    // Minimum length validation
    minLength: (value, min) => value && value.length >= min,
    
    // Maximum length validation
    maxLength: (value, max) => value && value.length <= max,
    
    // Number validation
    number: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
    
    // URL validation
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Storage Utilities
export const Storage = {
    // Local storage with JSON support
    local: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('localStorage set error:', error);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('localStorage get error:', error);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('localStorage remove error:', error);
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('localStorage clear error:', error);
                return false;
            }
        }
    },
    
    // Session storage with JSON support
    session: {
        set: (key, value) => {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('sessionStorage set error:', error);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('sessionStorage get error:', error);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('sessionStorage remove error:', error);
                return false;
            }
        },
        
        clear: () => {
            try {
                sessionStorage.clear();
                return true;
            } catch (error) {
                console.error('sessionStorage clear error:', error);
                return false;
            }
        }
    }
};

// HTTP Utilities
export const Http = {
    // Fetch wrapper with error handling
    request: async (url, options = {}) => {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('HTTP request error:', error);
            throw error;
        }
    },
    
    // GET request
    get: (url, options = {}) => Http.request(url, { ...options, method: 'GET' }),
    
    // POST request
    post: (url, data, options = {}) => Http.request(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // PUT request
    put: (url, data, options = {}) => Http.request(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    // DELETE request
    delete: (url, options = {}) => Http.request(url, { ...options, method: 'DELETE' })
};

// Animation Utilities
export const Animation = {
    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    // Fade in animation
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = '';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Fade out animation
    fadeOut: (element, duration = 300) => {
        const start = performance.now();
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Slide up animation
    slideUp: (element, duration = 300) => {
        const start = performance.now();
        const startHeight = element.offsetHeight;
        
        element.style.overflow = 'hidden';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = `${startHeight * (1 - progress)}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func(...args);
    };
};

// Throttle function
export const throttle = (func, limit) => {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Deep clone object
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

// Generate UUID
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

// Get device type
export const getDeviceType = () => {
    const width = window.innerWidth;
    
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

// Check if element is in viewport
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

console.log('Utils loaded successfully');