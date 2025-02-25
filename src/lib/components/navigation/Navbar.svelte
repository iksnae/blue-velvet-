<script>
	import { auth } from '$lib/stores/authStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// User authentication state
	let isAuthenticated = false;
	let userName = '';

	// Subscribe to auth store
	onMount(() => {
		const unsubscribe = auth.subscribe(state => {
			isAuthenticated = state.isAuthenticated;
			userName = state.user?.name || '';
		});

		return unsubscribe;
	});

	// Handle logout
	function handleLogout() {
		auth.logout();
		window.location.href = '/auth';
	}
</script>

<nav class="bg-blue-600 text-white shadow-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex-shrink-0 flex items-center">
					<span class="text-xl font-bold">Blue Velvet</span>
				</a>
				<div class="ml-6 flex space-x-4">
					<a
						href="/"
						class="px-3 py-2 rounded-md text-sm font-medium {$page.url.pathname === '/'
							? 'bg-blue-700 text-white'
							: 'text-white hover:bg-blue-500'}"
					>
						Home
					</a>
					<!-- Add more navigation links here -->
				</div>
			</div>

			<div class="flex items-center">
				{#if isAuthenticated}
					<div class="ml-3 relative flex items-center space-x-4">
						<span class="text-sm">Welcome, {userName}</span>
						<a
							href="/auth"
							class="px-3 py-1 rounded-md text-sm font-medium bg-blue-800 hover:bg-blue-700"
						>
							Account
						</a>
						<button
							on:click={handleLogout}
							class="px-3 py-1 rounded-md text-sm font-medium bg-red-600 hover:bg-red-500"
						>
							Logout
						</button>
					</div>
				{:else}
					<div>
						<a
							href="/auth"
							class="px-3 py-1 rounded-md text-sm font-medium bg-blue-800 hover:bg-blue-700"
						>
							Login / Register
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
