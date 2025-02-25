<script>
	import { auth } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	// Local state
	let accountData = null;
	let isLoading = true;
	let error = '';

	// Fetch account info on mount
	onMount(async () => {
		await fetchAccountInfo();
	});

	// Fetch account info from API
	async function fetchAccountInfo() {
		isLoading = true;
		error = '';

		try {
			const result = await auth.getAccountInfo();

			if (result.success) {
				accountData = result.data;
			} else {
				error = result.error || 'Failed to load account information.';
			}
		} catch (err) {
			error = err.message || 'An unexpected error occurred.';
		} finally {
			isLoading = false;
		}
	}

	// Handle logout
	function handleLogout() {
		auth.logout();
		window.location.href = '/auth'; // Redirect to login page
	}
</script>

<div class="account-info">
	<h2 class="text-2xl font-bold mb-6">Your Account</h2>

	{#if isLoading}
		<div class="flex justify-center items-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
			<span class="block sm:inline">{error}</span>
			<button
				on:click={fetchAccountInfo}
				class="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
			>
				Retry
			</button>
		</div>
	{:else if accountData}
		<div class="bg-white shadow rounded-lg p-6">
			<div class="mb-4">
				<h3 class="text-gray-700 text-sm">Name</h3>
				<p class="text-lg font-medium">{accountData.name}</p>
			</div>

			<div class="mb-4">
				<h3 class="text-gray-700 text-sm">Email</h3>
				<p class="text-lg font-medium">{accountData.email}</p>
			</div>

			<div class="mb-4">
				<h3 class="text-gray-700 text-sm">Account Type</h3>
				<p class="text-lg font-medium">{accountData.accountType}</p>
			</div>

			<div class="mb-4">
				<h3 class="text-gray-700 text-sm">Account ID</h3>
				<p class="text-lg font-medium font-mono text-sm break-all">{accountData.id}</p>
			</div>

			<div>
				<h3 class="text-gray-700 text-sm">Created At</h3>
				<p class="text-lg font-medium">
					{new Date(accountData.createdAt).toLocaleString()}
				</p>
			</div>
		</div>
	{:else}
		<p class="text-gray-700">No account information available.</p>
	{/if}

	<div class="mt-6">
		<button
			on:click={handleLogout}
			class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
		>
			Logout
		</button>
	</div>
</div>
