<script>
	import { auth } from '$lib/stores/authStore';
	import { createEventDispatcher } from 'svelte';

	// Create dispatcher for events
	const dispatch = createEventDispatcher();

	// Form state
	let email = '';
	let password = '';
	let isLoading = false;
	let error = '';

	// Handle form submission
	async function handleLogin() {
		error = '';
		isLoading = true;

		try {
			const result = await auth.login(email, password);

			if (result.success) {
				dispatch('success');
			} else {
				error = result.error || 'Login failed. Please try again.';
			}
		} catch (err) {
			error = err.message || 'An unexpected error occurred.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="login-form">
	<h2 class="text-2xl font-bold mb-6">Login</h2>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	<form on:submit|preventDefault={handleLogin}>
		<div class="mb-4">
			<label for="email" class="block text-sm font-medium mb-1">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="your.email@example.com"
				autocomplete="email"
			/>
		</div>

		<div class="mb-6">
			<label for="password" class="block text-sm font-medium mb-1">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="********"
				autocomplete="current-password"
			/>
		</div>

		<button
			type="submit"
			disabled={isLoading}
			class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
		>
			{#if isLoading}
				<span>Logging in...</span>
			{:else}
				<span>Login</span>
			{/if}
		</button>
	</form>

	<div class="mt-4 text-center">
		<button
			on:click={() => dispatch('switch', 'register')}
			class="text-blue-600 hover:text-blue-800 text-sm"
		>
			Need an account? Register
		</button>
	</div>
</div>
