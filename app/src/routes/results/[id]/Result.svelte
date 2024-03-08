<script>
	import Text from '$lib/text/Text.svelte';

	import { poll_category } from '../../polls/data';

	export let chat;
	export let result;

	const { poll_id, title, about, categories, questions } = result;
	const subtitle = categories.map((c) => poll_category[c]).join(', ');
</script>

<div class="col padding-20 gap-40 content-900">
	<div class="col top-20">
		<a class="top" href="/polls/{poll_id}">
			<h1 class="line-1">{title}</h1>
			<span class="subtitle">{subtitle}</span>
		</a>
		<Text text={about} />
	</div>

	{#each questions as { text, note, answers }, i (i)}
		<div>
			<h2>
				<span class="monospace">{i + 1}.</span>
				{text}
			</h2>
			<p>{note}</p>
			<div class="col gap-10 top-20">
				{#each answers as { text }, j (j)}
					<span class="link">{text}</span>
				{/each}
			</div>
		</div>
	{/each}

	{#if chat}
		<div class="center line-1">
			<a href="?type=3">Открыть чат</a>
		</div>
	{/if}
</div>
