<script>
	import { poll_category } from './data';

	import ToReact from './ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';

	import Date from '$lib/show/Date.svelte';
	import Text from '$lib/text/Text.svelte';

	export let poll;
	export let profile;

	const { id, title, about, author, changed } = poll;

	const getSubtitle = () => {
		let { categories, like } = poll;

		const names = [];
		names.push(categories.map((c) => poll_category[c]).join(', '));
		if (like) names.push(like);

		return names.join(' – ');
	};
</script>

<div class="col relative content-900 padding-20 gap-10">
	<a class="col top" href="/polls/{id}">
		<h2 class="line-1">{title}</h2>
		<span class="subtitle">{getSubtitle()}</span>
	</a>

	{#if about}
		<Text text={about} />
	{/if}

	<div class="row away center">
		<ToReact {profile} {poll} />

		<span class="right">
			<ToAuthor {author} />
			<Date time={changed} />
		</span>
	</div>
</div>
