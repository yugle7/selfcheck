<script>
	import { pb, screen } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	import { chat_type } from '$lib/chat/data';

	import Edit from './Edit.svelte';
	import Poll from './Poll.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';
	import Close from '$lib/show/Close.svelte';

	import Header from '../../chats/Header.svelte';

	export let data;
	let { poll, questions, results } = data;

	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;

	let edit;

	const { title, author } = poll;
</script>

<svelte:head>
	<title>Опрос – {title}</title>
	<meta name="description" content="Опрос: {title}, Автор: {author.username}" />
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if poll}
		{#if edit}
			<Close on:click={() => (edit = null)} />
			<Edit {poll} {questions} {results} on:click={() => (edit = false)} />
		{:else if $screen === 'params'}
			<div class="col center gap-20 padding-20">
				<Close on:click={() => ($screen = 'content')} />
				<a href="?type=2">{chat_type[2]}</a>
			</div>
		{:else}
			<Header type="2">Опрос</Header>
			<Poll {poll} {questions} {results} {profile} on:click={() => (edit = true)} />
		{/if}
	{/if}
{:else if poll}
	{#if edit}
		<Edit {poll} {questions} {results} on:click={() => (edit = false)} />
	{:else}
		<div class="scroll">
			<Poll {poll} {questions} {results} {profile} on:click={() => (edit = true)} />
		</div>
	{/if}
	{#if chat}
		<Resize>
			{#if chat}
				<Chat {chat} {talk} {profile} />
			{/if}
		</Resize>
	{/if}
{/if}
