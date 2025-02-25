import { json } from '@sveltejs/kit';

const API_BASE_URL = 'https://ikhsfhbxnd.execute-api.us-east-1.amazonaws.com/Prod';

export async function GET({ request }) {
	try {
		const authHeader = request.headers.get('authorization');
		
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return json({ error: 'Unauthorized - No token provided' }, { status: 401 });
		}
		
		// Forward the request to the account info endpoint
		const response = await fetch(`${API_BASE_URL}/account/info`, {
			method: 'GET',
			headers: {
				'Authorization': authHeader
			}
		});
		
		const data = await response.json();
		
		return json(data, { status: response.status });
	} catch (error) {
		console.error('Account info error:', error);
		return json({ error: 'Failed to get account info' }, { status: 500 });
	}
}
