<script>
	import { params } from '$lib';

	import { plus } from './data';
	import Question from './Question.svelte';

	let questions = $params.questions;
	$: $params.questions = questions;

	let id = 1;
	let question_id;

	$: value = JSON.stringify(questions);
</script>

<input type="hidden" name="questions" id="questions" bind:value />

<li
	class="col gap-40"
	on:drop={(e) => {
		if (!question_id) return;
		const i = questions.findIndex(({ id }) => id === question_id);
		if (i < 0) return;

		question_id = e.target.closest('li').id;
		if (!question_id) return;
		const j = questions.findIndex(({ id }) => id === question_id);
		if (j < 0) return;

		question_id = null;

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
	{#each questions as question, i (question.id)}
		<Question
			{i}
			{question}
			on:drag={() => (question_id = question.id)}
			on:dragend={() => (question_id = null)}
			on:click={() => (questions = questions.filter(({ id }) => id !== question.id))}
		/>
	{/each}
</li>

<button
	class="link"
	on:click|preventDefault={() =>
		(questions = [
			...questions,
			{
				id: (id++).toString(),
				type: 0,
				answers: [{ id: '0' }, { id: '1' }]
			}
		])}
>
	<span class="font-24">{plus}</span>
	Вопрос
</button>
