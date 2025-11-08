const SecurityConfig = {
    session: {
        isValid: function(userData) {
            if (!userData || !userData.signInTime) return false;
            const signInTime = new Date(userData.signInTime);
            const now = new Date();
            return (now - signInTime) < CONFIG.SESSION_DURATION;
        },
        refresh: function() {
            const userData = this.secureStorage.getItem('bharatDarshanUser');
            if (userData) {
                userData.lastActivity = new Date().toISOString();
                this.secureStorage.setItem('bharatDarshanUser', userData);
            }
        }
    },

    secureStorage: {
        setItem: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage error:', e);
                return false;
            }
        },
        getItem: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage error:', e);
                return null;
            }
        }
    },

    VALIDATION: {
        name: /^[a-zA-Z\s]{2,50}$/,
        phone: /^[6-9]\d{9}$/
    },

    RATE_LIMITS: CONFIG.RATE_LIMITS,

    rateLimiter: {
        isAllowed: function(action, config) {
            try {
                const key = `rateLimit_${action}`;
                const now = Date.now();
                const attempts = JSON.parse(localStorage.getItem(key) || '[]');
                
                const validAttempts = attempts.filter(time => now - time < config.windowMs);
                
                if (validAttempts.length >= config.maxAttempts) {
                    return false;
                }
                
                validAttempts.push(now);
                localStorage.setItem(key, JSON.stringify(validAttempts));
                return true;
            } catch (e) {
                console.error('Rate limiter error:', e);
                return true;
            }
        }
    },

    sanitizeInput: function(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>"'&]/g, '');
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};