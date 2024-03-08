<script>
	import { normText } from '$lib/edit/data';

	import ToResult from './ToResult.svelte';

	export let results;
	export let params;

	$: dst = !params.search ? results : results.filter(({ title }) => normText(title).includes(params.search));
</script>

{#if dst.length > 0}
	<ul class="top-5">
		{#each dst as result (result.id)}
			<li class="hover">
				<ToResult {result} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
