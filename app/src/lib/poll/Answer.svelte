<script>
	import { copyPaste } from '$lib/edit/data';

	export let type;
	export let answer;

	let selected;
	$: icon = (type ? 'box' : 'radio') + (selected ? '-check' : '');

	let dragged;
	let overlapped;
</script>

<li
	on:mouseenter={() => (selected = true)}
	on:mouseleave={() => (selected = false)}
	draggable="true"
	id={answer.id}
	on:drag
	on:dragstart={() => (dragged = true)}
	on:dragend={() => (dragged = false)}
	on:dragenter={() => (overlapped = true)}
	on:dragleave={() => (overlapped = false)}
	on:dragover={() => (overlapped = true)}
	on:dragexit={() => (dragged = overlapped = false)}
	on:drop={() => (dragged = overlapped = false)}
	class:dragged
	class:overlapped
>
	<img draggable="false" src="/icons/{icon}.svg" alt={icon} />
	<div
		role="textbox"
		tabindex="0"
		on:paste|preventDefault={copyPaste}
		contenteditable="true"
		placeholder="Ответ"
		bind:innerText={answer.text}
	/>
	<span class="monospace"> = </span>
	<input type="number" bind:value={answer.weight} min="0" max="99" placeholder="0" />

	<button class:hidden={!selected || dragged}  on:click|preventDefault>
		<img src="/icons/delete.svg" alt="delete" />
	</button>
</li>

<style>
	.monospace {
		padding-top: 5px;
	}
	li {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	div {
		width: fit-content;
	}
	div:empty:before {
		content: attr(placeholder);
		opacity: 0.5;
	}
	img {
		min-width: 24px;
	}
	button > img {
		width: 30px;
	}
	button {
		margin-left: auto;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
