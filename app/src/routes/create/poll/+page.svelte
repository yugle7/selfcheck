<script>
	import { enhance } from '$app/forms';
	import { params, screen } from '$lib';

	import Selects from '$lib/edit/Selects.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { poll_category } from '../../polls/data';

	import Questions from '$lib/poll/Questions.svelte';
	import Results from '$lib/poll/Results.svelte';

	let questions;
	let results;

	$params = {
		categories: [],
		questions: [{ index: 0, type: 0, answers: [{ index: 0 }, { index: 1 }] }],
		results: [{ index: 0 }, { index: 1 }]
	};
	const p = JSON.stringify($params);
	$: disabled = p === JSON.stringify($params);
</script>

<form method="post" class="col content-900 padding-20 gap-40" use:enhance>
	<div class="col gap-10">
		<Text key="title" title="Название" />
		<Selects key="categories" title="Направление" labels={poll_category} />
		<Text key="about" title="Описание" />
	</div>

	<input type="hidden" name="questions" id="questions" bind:value={questions} />
	<input type="hidden" name="results" id="results" bind:value={results} />

	<Questions />
	<Results />

	<div class="row gap-15 center right">
		{#if !$screen}
			<button on:click|preventDefault>Отменить</button>
		{/if}
		<button
			class="button"
			{disabled}
			type="submit"
			on:click={() => {
				questions = JSON.stringify($params.questions);
				results = JSON.stringify($params.results);
			}}
		>
			Отправить
		</button>
	</div>
</form>
