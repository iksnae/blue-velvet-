import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { auth } from '$lib/stores/authStore';

// Check if user is authenticated
export function isAuthenticated() {
	if (!browser) {
		return false;
	}
	
	return get(auth).isAuthenticated;
}

// Protect route - redirect to /auth if not authenticated
export function protectRoute(redirectTo = '/auth') {
	if (browser && !isAuthenticated()) {
		goto(redirectTo);
		return false;
	}
	
	return true;
}

// Get authentication token
export function getToken() {
	if (!browser) {
		return null;
	}
	
	return get(auth).token;
}

// Add authorization header to fetch requests
export function authFetch(url, options = {}) {
	const token = getToken();
	
	if (!token) {
		return fetch(url, options);
	}
	
	const headers = {
		...options.headers,
		'Authorization': `Bearer ${token}`
	};
	
	return fetch(url, {
		...options,
		headers
	});
}
