<script>
	import { page } from '$app/stores';
	import { screen } from '$lib';

	import {
		poll_status,
		poll_sort,
		poll_category,
		default_params
	} from './data';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';

	import Polls from './Polls.svelte';

	import Params from './Params.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	export let data;

	$: params = data.params;
	$: profile = data.profile;

	const getTitle = (params) => {
		if (!params) return '';

		const { sort, status, category, author_id } = params;
		const names = [poll_sort[sort]];
		if (status != default_params.status) names.push(poll_status[status]);
		if (category != null) names.push(poll_category[category]);
		if ($page.url.searchParams.get('search')) names.push('Поиск');
		if (author_id) names.push('Автор');
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Опросы – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Опросы</Header>

	{#await data.polls}
		<h1 class="title shy line-3">Получаем</h1>
	{:then polls}
		<h1 class="title line-2">{getTitle(params)}</h1>
		<Polls {polls} {params} {profile} />
	{/await}

	<Page {default_params}>
		<Params {profile} />
	</Page>
{:else}
	<Smooth>
		{#await data.polls}
			<h1 class="title shy line-3">Получаем</h1>
		{:then polls}
			<Polls {polls} {params} {profile} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params {profile} />
		</Side>
	</Resize>
{/if}
