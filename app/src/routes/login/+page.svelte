<script>
	import { checkPassword, auth_provider, checkLogin } from '../signup/data';
	import { back } from '$lib';
	import { onMount } from 'svelte';

	export let data;
	export let form;

	let login = '';
	let password = '';

	let errors = {};

	$: disabled = errors.password || errors.login || form?.error || password === '' || login === '';

	let user_id;
	onMount(() => (user_id = localStorage.getItem('user_id')));
</script>

<svelte:head>
	<title>Вход</title>
</svelte:head>

<form class="auth" method="post" action="?/login">
	{#if data.providers.length > 0}
		{#each data.providers as provider}
			<button class="button" formaction="?/{provider.name}">
				{auth_provider[provider.name]}
			</button>
		{/each}
		<span class="center font-14">или</span>
	{/if}

	<div class="col">
		<input
			class="input"
			class:failed={errors.login}
			placeholder="Email или Username"
			bind:value={login}
			on:keydown={() => {
				delete errors.login;
				if (form) delete form.error;
			}}
			on:blur={() => {
				errors.login = checkLogin(login);
			}}
			id="login"
			type="text"
			name="login"
		/>
		{#if errors.login}
			<span class="failed">{errors.login}</span>
		{/if}
	</div>

	<div class="col">
		<input
			class="input"
			class:failed={errors.password}
			placeholder="Пароль"
			bind:value={password}
			on:keydown={() => {
				delete errors.password;
				if (form) delete form.error;
			}}
			on:blur={() => {
				errors.password = checkPassword(password);
			}}
			id="password"
			type="password"
			name="password"
		/>
		{#if errors.password}
			<span class="failed">{errors.password}</span>
		{/if}
		<a class="right font-14" href="/reset">Забыл пароль?</a>
	</div>

	{#if $back}
		<input type="hidden" value={$back} name="back" id="back" />
	{/if}
	{#if user_id}
		<input type="hidden" value={user_id} name="user_id" id="user_id" />
	{/if}

	<div class="col">
		{#if form?.error}
			<span class="failed">{form.error}</span>
		{/if}
		<button class="button" {disabled} type="submit"> Войти </button>
		<a class="right font-14" href="/signup">Eще нет аккаунта?</a>
	</div>
</form>
