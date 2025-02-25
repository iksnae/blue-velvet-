<script>
	import { auth } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	let isAuthenticated = false;
	let userName = '';

	onMount(() => {
		const unsubscribe = auth.subscribe(state => {
			isAuthenticated = state.isAuthenticated;
			userName = state.user?.name || '';
		});

		return unsubscribe;
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="text-center">
		<h1 class="text-4xl font-bold mb-8">Welcome to Blue Velvet</h1>

		{#if isAuthenticated}
			<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
				<p>Welcome back, <strong>{userName}</strong>! You are logged in.</p>
			</div>

			<div class="mt-8">
				<a href="/auth" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					View Account
				</a>
			</div>
		{:else}
			<p class="mb-8 text-xl text-gray-600">Please log in or register to access all features.</p>

			<div class="flex justify-center space-x-4">
				<a href="/auth" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Login
				</a>
				<a href="/auth?view=register" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
					Register
				</a>
			</div>
		{/if}
	</div>
</div>
