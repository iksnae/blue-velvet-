import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize auth store with values from localStorage if available
const storedAuth = browser && localStorage.getItem('auth');
const initialValue = storedAuth ? JSON.parse(storedAuth) : {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false
};

// Create the store
const authStore = writable(initialValue);

// Auth store functions
export const auth = {
    ...authStore,
    
    // Login user and store tokens
    login: async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            
            // Update store
            const authData = {
                user: {
                    email,
                    // Add any other user data here
                },
                token: data.token,
                refreshToken: data.refreshToken,
                isAuthenticated: true
            };
            
            authStore.set(authData);
            
            // Store in localStorage
            if (browser) {
                localStorage.setItem('auth', JSON.stringify(authData));
            }
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Register a new user
    register: async (email, password, name) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Verify account with confirmation code
    verify: async (email, confirmationCode) => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, confirmationCode })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Verification failed');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Verification error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Refresh the authentication token
    refreshAuth: async () => {
        let state;
        authStore.subscribe(value => {
            state = value;
        })();
        
        if (!state.refreshToken) {
            return { success: false, error: 'No refresh token available' };
        }
        
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: state.refreshToken })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Token refresh failed');
            }
            
            const data = await response.json();
            
            // Update token in store
            authStore.update(state => ({
                ...state,
                token: data.token,
                refreshToken: data.refreshToken || state.refreshToken
            }));
            
            // Update localStorage
            if (browser) {
                localStorage.setItem('auth', JSON.stringify({
                    ...state,
                    token: data.token,
                    refreshToken: data.refreshToken || state.refreshToken
                }));
            }
            
            return { success: true };
        } catch (error) {
            console.error('Token refresh error:', error);
            // If refresh fails, log the user out
            auth.logout();
            return { success: false, error: error.message };
        }
    },
    
    // Get user account information
    getAccountInfo: async () => {
        let state;
        authStore.subscribe(value => {
            state = value;
        })();
        
        if (!state.token) {
            return { success: false, error: 'No authentication token available' };
        }
        
        try {
            const response = await fetch('/api/auth/info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to get account info');
            }
            
            const data = await response.json();
            
            // Update user data in store
            authStore.update(state => ({
                ...state,
                user: data.accountData
            }));
            
            // Update localStorage
            if (browser) {
                localStorage.setItem('auth', JSON.stringify({
                    ...state,
                    user: data.accountData
                }));
            }
            
            return { success: true, data: data.accountData };
        } catch (error) {
            console.error('Get account info error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Logout user
    logout: () => {
        // Clear store
        authStore.set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false
        });
        
        // Clear localStorage
        if (browser) {
            localStorage.removeItem('auth');
        }
    }
};

export default auth;
