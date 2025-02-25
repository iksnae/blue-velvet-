<script>
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
	import VerifyForm from '$lib/components/auth/VerifyForm.svelte';
	import AccountInfo from '$lib/components/auth/AccountInfo.svelte';
	import { auth } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	// State for active view
	let view = 'login';
	let verifyEmail = '';
	let isAuthenticated = false;

	// Check authentication status on mount
	onMount(() => {
		const unsubscribe = auth.subscribe(state => {
			isAuthenticated = state.isAuthenticated;
		});

		return unsubscribe;
	});

	// Handle view switching
	function switchView(event) {
		if (typeof event === 'object' && event.detail) {
			view = event.detail;
		} else {
			view = event;
		}
	}

	// Handle registration success
	function handleRegisterSuccess(event) {
		verifyEmail = event.detail.email;
		view = 'verify';
	}

	// Handle login success
	function handleLoginSuccess() {
		// Load account info after successful login
		view = 'account';
	}

	// Handle verification success
	function handleVerifySuccess() {
		view = 'login';
	}
</script>

<div class="auth-container max-w-lg mx-auto p-6">
	{#if isAuthenticated}
		<AccountInfo />
	{:else}
		{#if view === 'login'}
			<LoginForm on:switch={switchView} on:success={handleLoginSuccess} />
		{:else if view === 'register'}
			<RegisterForm on:switch={switchView} on:success={handleRegisterSuccess} />
		{:else if view === 'verify'}
			<VerifyForm email={verifyEmail} on:switch={switchView} on:success={handleVerifySuccess} />
		{/if}
	{/if}
</div>

<style>
	.auth-container {
		min-height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
