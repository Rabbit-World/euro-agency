/**
 * GDPR Knowledge Challenge - Consent Management System
 * 
 * This file contains the implementation of a GDPR-compliant consent management system
 * for the GDPR educational game. It handles the display of consent banners, storage
 * of consent preferences, and provides methods for managing user consent.
 */

// ===== Consent Management Namespace =====
const ConsentManager = {
    // Configuration
    config: {
        storageKey: 'gdpr_consent',
        consentVersion: '1.0', // Increment when consent requirements change
        consentExpiry: 180, // Days until consent prompt is shown again
        cookieCategories: {
            necessary: {
                name: 'Necessary',
                description: 'These are essential for the game to function properly. They enable basic functions like saving your current game state and consent preferences.',
                required: true
            },
            preferences: {
                name: 'Preferences',
                description: 'These allow the game to remember your settings and preferences for future visits, such as your player name, country, and difficulty level.',
                required: false
            },
            analytics: {
                name: 'Analytics',
                description: 'These help us understand how you interact with the game so we can improve it. They collect anonymous usage data to enhance the game experience.',
                required: false
            }
        }
    },

    // State
    state: {
        consentGiven: false,
        consents: {
            necessary: false,
            preferences: false,
            analytics: false
        },
        consentDate: null,
        consentVersion: null,
        isCustomizing: false
    },

    // DOM Elements
    elements: {
        banner: null,
        customizeModal: null,
        privacySettingsButton: null
    },

    // ===== Initialization =====
    init: function() {
        // Initialize DOM references
        this.elements.banner = document.getElementById('gdpr-consent');
        this.elements.privacySettingsButton = document.createElement('button');
        this.elements.privacySettingsButton.id = 'privacy-settings';
        this.elements.privacySettingsButton.className = 'privacy-settings-btn';
        this.elements.privacySettingsButton.textContent = 'Privacy Settings';
        this.elements.privacySettingsButton.setAttribute('aria-label', 'Open Privacy Settings');
        
        // Create and append the customize modal (hidden by default)
        this.createCustomizeModal();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for existing consent
        this.checkExistingConsent();
        
        console.log('Consent Manager initialized');
    },

    // ===== Event Listeners =====
    setupEventListeners: function() {
        // Main consent banner buttons
        document.getElementById('accept-all').addEventListener('click', () => this.handleConsent('all'));
        document.getElementById('accept-necessary').addEventListener('click', () => this.handleConsent('necessary'));
        document.getElementById('customize-settings').addEventListener('click', () => this.showCustomizeModal());
        
        // Privacy settings button in footer
        this.elements.privacySettingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCustomizeModal();
        });
        
        // Add privacy settings button to footer
        const footer = document.querySelector('footer');
        if (footer) {
            const footerContent = footer.querySelector('p');
            if (footerContent) {
                footerContent.appendChild(document.createTextNode(' | '));
                footerContent.appendChild(this.elements.privacySettingsButton);
            }
        }
        
        // Listen for privacy policy link clicks
        const privacyPolicyLink = document.getElementById('privacy-policy');
        if (privacyPolicyLink) {
            privacyPolicyLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'privacy-policy.html';
            });
        }
    },

    // ===== Consent Modal Creation =====
    createCustomizeModal: function() {
        // Create modal container
        this.elements.customizeModal = document.createElement('div');
        this.elements.customizeModal.id = 'consent-customize-modal';
        this.elements.customizeModal.className = 'consent-modal';
        this.elements.customizeModal.setAttribute('role', 'dialog');
        this.elements.customizeModal.setAttribute('aria-labelledby', 'consent-modal-title');
        this.elements.customizeModal.setAttribute('aria-hidden', 'true');
        
        // Create modal content
        const modalHTML = `
            <div class="consent-modal-content">
                <div class="consent-modal-header">
                    <h2 id="consent-modal-title">Customize Privacy Settings</h2>
                    <button class="consent-close-btn" aria-label="Close privacy settings">&times;</button>
                </div>
                <div class="consent-modal-body">
                    <p>Please select which types of cookies you want to accept. Necessary cookies cannot be disabled as they are required for the game to function properly.</p>
                    
                    <div class="consent-options">
                        <div class="consent-option">
                            <div class="consent-option-header">
                                <label class="consent-switch">
                                    <input type="checkbox" id="consent-necessary" checked disabled>
                                    <span class="consent-slider"></span>
                                </label>
                                <h3>Necessary Cookies</h3>
                            </div>
                            <p>${this.config.cookieCategories.necessary.description}</p>
                        </div>
                        
                        <div class="consent-option">
                            <div class="consent-option-header">
                                <label class="consent-switch">
                                    <input type="checkbox" id="consent-preferences">
                                    <span class="consent-slider"></span>
                                </label>
                                <h3>Preference Cookies</h3>
                            </div>
                            <p>${this.config.cookieCategories.preferences.description}</p>
                        </div>
                        
                        <div class="consent-option">
                            <div class="consent-option-header">
                                <label class="consent-switch">
                                    <input type="checkbox" id="consent-analytics">
                                    <span class="consent-slider"></span>
                                </label>
                                <h3>Analytics Cookies</h3>
                            </div>
                            <p>${this.config.cookieCategories.analytics.description}</p>
                        </div>
                    </div>
                </div>
                <div class="consent-modal-footer">
                    <button id="consent-save-preferences" class="btn btn-primary">Save Preferences</button>
                    <button id="consent-accept-all" class="btn btn-secondary">Accept All</button>
                </div>
            </div>
        `;
        
        this.elements.customizeModal.innerHTML = modalHTML;
        document.body.appendChild(this.elements.customizeModal);
        
        // Add event listeners for the modal
        this.elements.customizeModal.querySelector('.consent-close-btn').addEventListener('click', () => {
            this.hideCustomizeModal();
        });
        
        this.elements.customizeModal.querySelector('#consent-save-preferences').addEventListener('click', () => {
            this.saveCustomPreferences();
        });
        
        this.elements.customizeModal.querySelector('#consent-accept-all').addEventListener('click', () => {
            this.handleConsent('all');
            this.hideCustomizeModal();
        });
        
        // Close modal when clicking outside
        this.elements.customizeModal.addEventListener('click', (e) => {
            if (e.target === this.elements.customizeModal) {
                this.hideCustomizeModal();
            }
        });
        
        // Add escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.elements.customizeModal.getAttribute('aria-hidden') === 'false') {
                this.hideCustomizeModal();
            }
        });
    },

    // ===== Consent Management =====
    checkExistingConsent: function() {
        const storedConsent = this.getFromStorage(this.config.storageKey);
        
        if (storedConsent) {
            try {
                const consentData = JSON.parse(storedConsent);
                
                // Check if consent version matches current version
                if (consentData.version === this.config.consentVersion) {
                    this.state.consentGiven = true;
                    this.state.consents = consentData.consents;
                    this.state.consentDate = new Date(consentData.date);
                    this.state.consentVersion = consentData.version;
                    
                    // Check if consent has expired
                    const expiryDate = new Date(this.state.consentDate);
                    expiryDate.setDate(expiryDate.getDate() + this.config.consentExpiry);
                    
                    if (new Date() > expiryDate) {
                        // Consent has expired, show banner again
                        this.showConsentBanner();
                    } else {
                        // Valid consent exists, hide banner
                        this.hideConsentBanner();
                        
                        // Apply consent to game
                        this.applyConsent();
                    }
                } else {
                    // Consent version has changed, show banner again
                    this.showConsentBanner();
                }
            } catch (e) {
                console.error('Error parsing consent data:', e);
                this.showConsentBanner();
            }
        } else {
            // No consent stored, show banner
            this.showConsentBanner();
        }
    },

    handleConsent: function(level) {
        switch(level) {
            case 'all':
                this.state.consents = {
                    necessary: true,
                    preferences: true,
                    analytics: true
                };
                break;
            case 'necessary':
                this.state.consents = {
                    necessary: true,
                    preferences: false,
                    analytics: false
                };
                break;
            // Custom preferences are handled by saveCustomPreferences()
        }
        
        this.state.consentGiven = true;
        this.state.consentDate = new Date();
        this.state.consentVersion = this.config.consentVersion;
        
        // Save consent to storage
        this.saveConsentToStorage();
        
        // Hide consent banner
        this.hideConsentBanner();
        
        // Apply consent to game
        this.applyConsent();
    },

    saveCustomPreferences: function() {
        // Get values from checkboxes
        const preferencesConsent = document.getElementById('consent-preferences').checked;
        const analyticsConsent = document.getElementById('consent-analytics').checked;
        
        // Update state
        this.state.consents = {
            necessary: true, // Always required
            preferences: preferencesConsent,
            analytics: analyticsConsent
        };
        
        this.state.consentGiven = true;
        this.state.consentDate = new Date();
        this.state.consentVersion = this.config.consentVersion;
        
        // Save consent to storage
        this.saveConsentToStorage();
        
        // Hide modal and banner
        this.hideCustomizeModal();
        this.hideConsentBanner();
        
        // Apply consent to game
        this.applyConsent();
    },

    saveConsentToStorage: function() {
        const consentData = {
            consents: this.state.consents,
            date: this.state.consentDate.toISOString(),
            version: this.state.consentVersion
        };
        
        this.saveToStorage(this.config.storageKey, JSON.stringify(consentData));
    },

    applyConsent: function() {
        // Update game state with consent preferences
        if (window.GDPRGame && window.GDPRGame.state) {
            window.GDPRGame.state.consent = this.state.consents;
        }
        
        // Dispatch event for other components to react to consent changes
        const consentEvent = new CustomEvent('consentUpdated', {
            detail: {
                consents: this.state.consents
            }
        });
        document.dispatchEvent(consentEvent);
    },

    // ===== UI Management =====
    showConsentBanner: function() {
        if (this.elements.banner) {
            this.elements.banner.style.display = 'block';
            this.elements.banner.setAttribute('aria-hidden', 'false');
        }
    },

    hideConsentBanner: function() {
        if (this.elements.banner) {
            this.elements.banner.style.display = 'none';
            this.elements.banner.setAttribute('aria-hidden', 'true');
        }
    },

    showCustomizeModal: function() {
        // Update checkbox states based on current consent
        document.getElementById('consent-preferences').checked = this.state.consents.preferences;
        document.getElementById('consent-analytics').checked = this.state.consents.analytics;
        
        // Show modal
        this.elements.customizeModal.style.display = 'block';
        this.elements.customizeModal.setAttribute('aria-hidden', 'false');
        
        // Focus first interactive element for accessibility
        setTimeout(() => {
            this.elements.customizeModal.querySelector('#consent-preferences').focus();
        }, 100);
    },

    hideCustomizeModal: function() {
        this.elements.customizeModal.style.display = 'none';
        this.elements.customizeModal.setAttribute('aria-hidden', 'true');
    },

    // ===== Storage Helpers =====
    saveToStorage: function(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    getFromStorage: function(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    // ===== Public API =====
    
    // Check if a specific consent type is granted
    hasConsent: function(consentType) {
        return this.state.consentGiven && this.state.consents[consentType] === true;
    },
    
    // Get all consent preferences
    getConsents: function() {
        return {...this.state.consents};
    },
    
    // Manually open privacy settings
    openPrivacySettings: function() {
        this.showCustomizeModal();
    },
    
    // Clear all consent data and show banner again
    resetConsent: function() {
        localStorage.removeItem(this.config.storageKey);
        this.state.consentGiven = false;
        this.state.consents = {
            necessary: false,
            preferences: false,
            analytics: false
        };
        this.state.consentDate = null;
        this.state.consentVersion = null;
        
        this.showConsentBanner();
    }
};

// Initialize the consent manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    ConsentManager.init();
});