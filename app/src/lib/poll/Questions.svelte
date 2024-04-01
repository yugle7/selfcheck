<script>
	import { params } from '$lib';

	import { plus } from './data';
	import Question from './Question.svelte';

	let questions = $params.questions;
	$: $params.questions = questions;

	let index = questions.length;
	let id;

	$: value = JSON.stringify(questions);
</script>

<input type="hidden" name="questions" id="questions" bind:value />

<li
	class="col gap-40"
	on:drop={(e) => {
		if (!id) return;
		const i = questions.findIndex(({ index }) => index === id);
		if (i < 0) return;

		id = e.target.closest('li').id;
		if (!id) return;
		const j = questions.findIndex(({ index }) => index === id);
		if (j < 0) return;

		id = null;

		if (i < j) {
			questions = [
				...questions.slice(0, i),
				...questions.slice(i + 1, j + 1),
				questions[i],
				...questions.slice(j + 1)
			];
		} else if (j < i) {
			questions = [
				...questions.slice(0, j),
				questions[i],
				...questions.slice(j, i),
				...questions.slice(i + 1)
			];
		}
	}}
	on:dragover={(e) => e.preventDefault()}
>
	{#each questions as question, i (question.index)}
		<Question
			{i}
			{question}
			on:drag={() => (id = question.index)}
			on:dragend={() => (id = null)}
			on:click={() => (questions = questions.filter(({ index }) => index !== question.index))}
		/>
	{/each}
</li>

<button
	class="link"
	on:click|preventDefault={() =>
		(questions = [
			...questions,
			{
				index: index++,
				type: 0,
				answers: [{ index: 0 }, { index: 1 }]
			}
		])}
>
	<span class="font-24">{plus}</span>
	Вопрос
</button>
