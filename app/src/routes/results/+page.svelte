<script>
	import { page } from '$app/stores';
	import { screen } from '$lib';

	import { poll_status, poll_sort, poll_category, default_params } from '../polls/data';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';

	import Results from './Results.svelte';

	import Params from './Params.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	export let data;

	$: profile = data.profile;
	$: params = getParams($page.url.searchParams);

	const getParams = (data) => {
		const params = { ...default_params };
		for (const key of ['category', 'author_id', 'search']) params[key] = data.get(key);

		const sort = data.get('sort');
		if (sort) params.sort = sort;

		if (profile) {
			const status = data.get('status');
			if (status != null && profile.role >= 2) params.status = parseInt(status);
		}
		return params;
	};

	const getTitle = (params) => {
		if (!params) return '';

		const { sort, search, status, category, author_id } = params;
		const names = [poll_sort[sort]];
		if (status != default_params.status) names.push(poll_status[status]);
		if (category != null) names.push(poll_category[category]);
		if (search) names.push('Поиск');
		if (author_id) names.push('Автор');
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Результат – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Результаты</Header>

	{#await data.results}
		<h1 class="title shy line-3">Получаем</h1>
	{:then results}
		<h1 class="title line-2">{getTitle(params)}</h1>
		<Results {results} {params} />
	{/await}

	<Page {default_params}>
		<Params {profile} />
	</Page>
{:else}
	<Smooth>
		{#await data.results}
			<h1 class="title shy line-3">Получаем</h1>
		{:then results}
			<Results {results} {params} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params {profile} />
		</Side>
	</Resize>
{/if}
