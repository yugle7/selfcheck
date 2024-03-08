<script>
	import { page } from '$app/stores';
	import { normText } from '$lib/edit/data';

	import ToPoll from './ToPoll.svelte';

	export let polls;
	export let profile;

	export let params;

	$: search = $page.url.searchParams.get('search') || null;
	$: dst = search == null ? polls : polls.filter(({ title }) => normText(title).includes(search));
</script>

{#if dst.length > 0}
	<ul class="top-5">
		{#each dst as poll (poll.id)}
			<li class="hover">
				<ToPoll {poll} {params} {profile} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
