<script>
	import { params } from '$lib';

	import { plus } from './data';
	import Result from './Result.svelte';

	let results = $params.results;
	$: $params.results = results;

	let id = 2;
	let result_id;
</script>

<ul
	class="col gap-10"
	on:drop={(e) => {
		if (!result_id) return;
		const i = results.findIndex(({ id }) => id === result_id);
		if (i < 0) return;

		result_id = e.target.closest('li').id;
		if (!result_id) return;
		const j = results.findIndex(({ id }) => id === result_id);
		if (j < 0) return;

		result_id = null;

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
	{#each results as result (result.id)}
		<Result
			{result}
			on:drag={() => (result_id = result.id)}
			on:dragend={() => (result_id = null)}
			on:click={() => (results = results.filter(({ id }) => id !== result.id))}
		/>
	{/each}

	<button
		class="link"
		on:click|preventDefault={() => (results = [...results, { id: (id++).toString() }])}
	>
		<span class="font-24">{plus}</span>
		Результат
	</button>
</ul>
