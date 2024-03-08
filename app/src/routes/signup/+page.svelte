<script>
	import { checkPassword, checkEmail, checkUsername } from './data';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let form;

	let username = '';
	let email = '';
	let password = '';

	let errors = {};

	$: disabled =
		errors.username ||
		errors.email ||
		errors.password ||
		username === '' ||
		email === '' ||
		password === '';

	let user_id;
	onMount(() => (user_id = localStorage.getItem('user_id')));
	$: if (user_id && form?.profile) localStorage.removeItem('user_id');
</script>

<svelte:head>
	<title>Регистрация</title>
</svelte:head>

{#if form?.profile}
	<div class="auth">
		<p>
			Hа почту <code>{email}</code> отправлено письмо с просьбой ее подтвердить.
		</p>
		<a href="/users/{form.profile.username}">Перейти в аккаунт?</a>
	</div>
{:else}
	<form
		class="auth"
		method="post"
		use:enhance={(cancel) => {
			if (disabled) cancel();
		}}
	>
		<div class="col">
			<input
				class="input"
				class:failed={errors.username}
				placeholder="Логин"
				bind:value={username}
				on:keydown={() => {
					delete errors.username;
					if (form) delete form.error;
				}}
				on:blur={() => {
					errors.username = checkUsername(username);
				}}
				id="username"
				type="text"
				name="username"
				required
			/>
			{#if errors.username}
				<span class="failed">{errors.username}</span>
			{/if}
		</div>

		<div class="col">
			<input
				class="input"
				class:failed={errors.email}
				placeholder="Email"
				bind:value={email}
				on:keydown={() => {
					delete errors.email;
					if (form) delete form.error;
				}}
				on:blur={() => {
					errors.email = checkEmail(email);
				}}
				id="email"
				type="email"
				name="email"
				required
			/>
			{#if errors.email}
				<span class="failed">{errors.email}</span>
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
				required
			/>
			{#if errors.password}
				<span class="failed">{errors.password}</span>
			{/if}
		</div>

		{#if user_id}
			<input type="hidden" value={user_id} name="user_id" id="user_id" />
		{/if}

		<div class="col">
			{#if form?.error}
				<span class="failed">{form.error}</span>
			{/if}
			<button class="button" {disabled} type="submit">Регистрация</button>
			<a class="right font-14" href="/login">Вернуться в форму входа?</a>
		</div>
	</form>
{/if}
