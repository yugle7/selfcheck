<script>
	import Answer from './Answer.svelte';

	export let index;
	export let question;
	const { type, note, text, answers } = question;

	let value = 0;
</script>

<div>
	<h2>
		<span class="monospace">{index}.</span>
		{text}
	</h2>
	<p>{note}</p>
	<div class="col gap-10 top-20">
		{#each answers as answer, i (i)}
			<Answer
				{answer}
				{type}
				selected={value & (1 << i)}
				on:click={() => (value = type ? value ^ (1 << i) : 1 << i)}
			/>
		{/each}
	</div>
</div>
