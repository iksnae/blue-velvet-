import { json } from '@sveltejs/kit';

const API_BASE_URL = 'https://ikhsfhbxnd.execute-api.us-east-1.amazonaws.com/Prod';

/**
 * This module provides the API for the Svelte app to authenticate, enabling:
 * - login
 * - register
 * - verify
 * - refresh
 * - logout
 * 
 * Routes are handled via the dedicated endpoint handlers in their respective directories
 */

// Handle POST requests to API endpoints for backwards compatibility
export async function POST({ request, url }) {
    const path = url.pathname.split('/').pop();
    const endpoint = mapEndpoint(path);
    
    if (!endpoint) {
        return json({ error: 'Invalid endpoint' }, { status: 404 });
    }
    
    try {
        const body = await request.json();
        const apiUrl = `${API_BASE_URL}${endpoint}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Auth API error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Handle GET requests to account/info endpoint
export async function GET({ request, url }) {
    // Only handle the /account/info endpoint
    if (url.pathname.split('/').pop() !== 'info') {
        return json({ error: 'Invalid endpoint' }, { status: 404 });
    }
    
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        
        if (!token) {
            return json({ error: 'Unauthorized - No token provided' }, { status: 401 });
        }
        
        const apiUrl = `${API_BASE_URL}/account/info`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Auth API error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Map frontend paths to backend endpoints
function mapEndpoint(path) {
    const endpointMap = {
        'login': '/account/authenticate',
        'register': '/account/register',
        'verify': '/account/verify',
        'refresh': '/account/refresh',
        'info': '/account/info'
    };
    
    return endpointMap[path];
}
