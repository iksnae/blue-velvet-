<script>
	import { auth } from '$lib/stores/authStore';
	import { createEventDispatcher } from 'svelte';

	// Create dispatcher for events
	const dispatch = createEventDispatcher();

	// Form state
	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let isLoading = false;
	let error = '';

	// Handle form submission
	async function handleRegister() {
		error = '';

		// Validate password match
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		isLoading = true;

		try {
			const result = await auth.register(email, password, name);

			if (result.success) {
				dispatch('success', { email });
			} else {
				error = result.error || 'Registration failed. Please try again.';
			}
		} catch (err) {
			error = err.message || 'An unexpected error occurred.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="register-form">
	<h2 class="text-2xl font-bold mb-6">Create an Account</h2>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	<form on:submit|preventDefault={handleRegister}>
		<div class="mb-4">
			<label for="name" class="block text-sm font-medium mb-1">Full Name</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="Your Name"
				autocomplete="name"
			/>
		</div>

		<div class="mb-4">
			<label for="register-email" class="block text-sm font-medium mb-1">Email</label>
			<input
				type="email"
				id="register-email"
				bind:value={email}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="your.email@example.com"
				autocomplete="email"
			/>
		</div>

		<div class="mb-4">
			<label for="register-password" class="block text-sm font-medium mb-1">Password</label>
			<input
				type="password"
				id="register-password"
				bind:value={password}
				required
				minlength="8"
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="********"
				autocomplete="new-password"
			/>
			<p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters.</p>
		</div>

		<div class="mb-6">
			<label for="confirm-password" class="block text-sm font-medium mb-1">Confirm Password</label>
			<input
				type="password"
				id="confirm-password"
				bind:value={confirmPassword}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="********"
				autocomplete="new-password"
			/>
		</div>

		<button
			type="submit"
			disabled={isLoading}
			class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
		>
			{#if isLoading}
				<span>Creating Account...</span>
			{:else}
				<span>Register</span>
			{/if}
		</button>
	</form>

	<div class="mt-4 text-center">
		<button
			on:click={() => dispatch('switch', 'login')}
			class="text-blue-600 hover:text-blue-800 text-sm"
		>
			Already have an account? Login
		</button>
	</div>
</div>
