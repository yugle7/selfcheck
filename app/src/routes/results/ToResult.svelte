<script>
	import { poll_category } from '../polls/data';

	import Date from '$lib/show/Date.svelte';
	import Text from '$lib/text/Text.svelte';

	export let result;
	const { id, title, categories, text, updated } = result;
</script>

<div class="col content-900 padding-20 gap-10">
	<div class="col relative">
		<a class="top" href="/results/{id}">
			<h2 class="right-50">{title}</h2>
			<span class="subtitle">{categories.map((c) => poll_category[c]).join(', ')}</span>
		</a>
		<span class="top-right">
			<Date time={updated} />
		</span>
	</div>
	<Text {text} />
</div>
