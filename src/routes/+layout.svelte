<script>
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import '../app.pcss';
</script>

<div class="app">
	<Navbar />
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>
