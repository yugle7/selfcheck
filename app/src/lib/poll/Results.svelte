<script>
	import { params } from '$lib';

	import { plus } from './data';
	import Result from './Result.svelte';

	let results = $params.results;
	$: $params.results = results;

	let index = results.length;
	let id;
</script>

<ul
	class="col gap-10"
	on:drop={(e) => {
		if (!id) return;
		const i = results.findIndex(({ index }) => index === id);
		if (i < 0) return;

		id = e.target.closest('li').id;
		if (!id) return;
		const j = results.findIndex(({ index }) => index === id);
		if (j < 0) return;

		id = null;

		if (i < j) {
			results = [
				...results.slice(0, i),
				...results.slice(i + 1, j + 1),
				results[i],
				...results.slice(j + 1)
			];
		} else if (j < i) {
			results = [
				...results.slice(0, j),
				results[i],
				...results.slice(j, i),
				...results.slice(i + 1)
			];
		}
	}}
	on:dragover={(e) => e.preventDefault()}
>
	{#each results as result (result.index)}
		<Result
			{result}
			on:drag={() => (id = result.index)}
			on:dragend={() => (id = null)}
			on:click={() => (results = results.filter(({ index }) => index !== result.index))}
		/>
	{/each}

	<button
		class="link"
		on:click|preventDefault={() => (results = [...results, { index: index++ }])}
	>
		<span class="font-24">{plus}</span>
		Результат
	</button>
</ul>
