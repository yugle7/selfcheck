<script>
	import { icon_type } from '../data';

	export let selected;

	export let type;

	export let answer;
	const { text } = answer;

	$: answer.selected = selected;
	$: icon = selected ? icon_type[type] + '-check' : icon_type[type];
</script>

<button class="row link center gap-5" class:selected on:click|preventDefault>
	<img src="/icons/{icon}.svg" alt={icon} />
	{text}
</button>

<style>
	img {
		width: 24px;
		height: 24px;
	}
</style>
