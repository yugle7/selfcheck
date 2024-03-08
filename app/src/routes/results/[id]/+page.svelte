<script>
	import { screen } from '$lib';

	import { chat_type } from '$lib/chat/data';

	import Result from './Result.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';
	import Close from '$lib/show/Close.svelte';

	import Header from '../../chats/Header.svelte';

	export let data;
	const { result } = data;

	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;
</script>

<svelte:head>
	<title>Результат – {result.title}</title>
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if data}
		{#if $screen === 'params'}
			<div class="col center gap-20 padding-20">
				<Close on:click={() => ($screen = 'content')} />
				<a href="?type=3">{chat_type[3]}</a>
			</div>
		{:else}
			<Header type="3">Результат</Header>
			<Result {result} />
		{/if}
	{/if}
{:else if data}
	<div class="scroll">
		<Result {result} chat={!chat} />
	</div>
	{#if chat}
		<Resize>
			{#if chat}
				<Chat {chat} {talk} {profile} />
			{/if}
		</Resize>
	{/if}
{/if}
