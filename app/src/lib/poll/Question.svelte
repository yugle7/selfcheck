<script>
	import { question_type, plus } from './data';

	import { copyPaste } from '$lib/edit/data';
	import Answer from './Answer.svelte';

	export let i;
	export let question;

	let answers = question.answers;
	$: question.answers = answers;

	let id = 2;
	let answer_id;
	
	let selected;
	let dragged;
</script>

<li
	class="col gap-10 relative"
	on:mouseenter={() => (selected = true)}
	on:mouseleave={() => (selected = false)}
	draggable="true"
	id={question.id}
	on:drag
	on:dragstart={() => (dragged = true)}
	on:dragend={() => (dragged = false)}
	on:drop={() => (dragged = false)}
>
	<span class:hidden={!selected || dragged} class="top-right">
		<button class="link" on:click|preventDefault>
			<img src="/icons/close.svg" alt="remove" />
		</button>
	</span>

	<div class="row gap-10">
		<span class="font-16 line-1 monospace">{i + 1}.</span>
		<div
			role="textbox"
			tabindex="0"
			on:paste|preventDefault={copyPaste}
			contenteditable="true"
			placeholder="Вопрос"
			bind:innerText={question.text}
		/>
	</div>

	<div
		role="textbox"
		tabindex="0"
		on:paste|preventDefault={copyPaste}
		contenteditable="true"
		placeholder="Примечание"
		bind:innerText={question.note}
	/>

	<button
		class="link font-14"
		on:click|preventDefault={() => (question.type = (question.type + 1) % question_type.length)}
	>
		{question_type[question.type]}
	</button>
	<div
		role="listitem"
		id={question.id}
		on:drop={(e) => {
			if (!answer_id) return;
			const i = answers.findIndex(({ id }) => id === answer_id);
			if (i < 0) return;

			answer_id = e.target.closest('li').id;
			if (!answer_id) return;
			const j = answers.findIndex(({ id }) => id === answer_id);
			if (j < 0) return;

			answer_id = null;

			if (i < j) {
				answers = [
					...answers.slice(0, i),
					...answers.slice(i + 1, j + 1),
					answers[i],
					...answers.slice(j + 1)
				];
			} else if (j < i) {
				answers = [
					...answers.slice(0, j),
					answers[i],
					...answers.slice(j, i),
					...answers.slice(i + 1)
				];
			}
		}}
		on:dragover={(e) => e.preventDefault()}
	>
		<ul class="col gap-10 left-10">
			{#each answers as answer (answer.id)}
				<Answer
					{answer}
					type={question.type}
					on:drag={() => (answer_id = answer.id)}
					on:dragend={() => (answer_id = null)}
					on:click={() => (answers = answers.filter(({ id }) => id !== answer.id))}
				/>
			{/each}
		</ul>
	</div>
	
	<button
		class="link"
		on:click|preventDefault={() => (answers = [...answers, { id: (id++).toString() }])}
	>
		<span class="font-24">{plus}</span>
		Oтвет
	</button>
</li>

<style>
	div:empty:before {
		content: attr(placeholder);
		opacity: 0.5;
	}
</style>
