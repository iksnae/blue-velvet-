<script>
	import { auth } from '$lib/stores/authStore';
	import { createEventDispatcher } from 'svelte';

	// Props
	export let email = '';

	// Create dispatcher for events
	const dispatch = createEventDispatcher();

	// Form state
	let confirmationCode = '';
	let isLoading = false;
	let error = '';

	// Handle form submission
	async function handleVerify() {
		error = '';
		isLoading = true;

		try {
			const result = await auth.verify(email, confirmationCode);

			if (result.success) {
				dispatch('success');
			} else {
				error = result.error || 'Verification failed. Please try again.';
			}
		} catch (err) {
			error = err.message || 'An unexpected error occurred.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="verify-form">
	<h2 class="text-2xl font-bold mb-6">Verify Your Account</h2>

	<p class="mb-4 text-gray-700">
		Please check your email ({email}) for a verification code and enter it below.
	</p>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	<form on:submit|preventDefault={handleVerify}>
		<div class="mb-6">
			<label for="confirmation-code" class="block text-sm font-medium mb-1">Verification Code</label>
			<input
				type="text"
				id="confirmation-code"
				bind:value={confirmationCode}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				placeholder="Enter code"
			/>
		</div>

		<button
			type="submit"
			disabled={isLoading}
			class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
		>
			{#if isLoading}
				<span>Verifying...</span>
			{:else}
				<span>Verify Account</span>
			{/if}
		</button>
	</form>

	<div class="mt-4 text-center">
		<button
			on:click={() => dispatch('switch', 'login')}
			class="text-blue-600 hover:text-blue-800 text-sm"
		>
			Back to Login
		</button>
	</div>
</div>
