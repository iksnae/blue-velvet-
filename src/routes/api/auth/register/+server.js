import { json } from '@sveltejs/kit';

const API_BASE_URL = 'https://ikhsfhbxnd.execute-api.us-east-1.amazonaws.com/Prod';

export async function POST({ request }) {
	try {
		const body = await request.json();
		
		// Forward the request to the registration endpoint
		const response = await fetch(`${API_BASE_URL}/account/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		
		const data = await response.json();
		
		return json(data, { status: response.status });
	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: 'Registration failed' }, { status: 500 });
	}
}
