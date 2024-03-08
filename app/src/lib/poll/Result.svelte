<script>
	import { copyPaste } from '$lib/edit/data';

	export let result;

	let selected;

	let dragged;
	let overlapped;
</script>

<li
	on:mouseenter={() => (selected = false)}
	on:mouseleave={() => (selected = true)}
	on:mouseenter={() => (selected = true)}
	on:mouseleave={() => (selected = false)}
	draggable="true"
	id={result.id}
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
	<span class="link">–</span>
	<div
		role="textbox"
		tabindex="0"
		on:paste|preventDefault={copyPaste}
		contenteditable="true"
		placeholder="Результат"
		bind:innerText={result.text}
	/>
	<span class="monospace">&le;</span>
	<input name="weight" type="number" bind:value={result.weight} min="0" max="999" placeholder="0" />

	<button class:hidden={!selected || dragged} on:click|preventDefault>
		<img src="/icons/delete.svg" alt="delete" />
	</button>
</li>

<style>
	.dragged {
		opacity: 10%;
	}
	.overlapped {
		opacity: 30%;
	}
	.monospace {
		padding-top: 5px;
	}
	li {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	span {
		padding-right: 5px;
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
