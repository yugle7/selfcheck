<script>
	import { enhance, applyAction } from '$app/forms';

	import { poll_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let poll;
	export let profile;

	let { react, id } = poll;
</script>

{#if profile}
	<form class="row gap-5" method="post" action="/polls?/react" use:enhance={() => applyAction}>
		<input type="hidden" value={id} name="poll_id" id="poll_id" />
		<input type="hidden" value={react} name="react" id="react" />

		{#each poll_react as r (r)}
			<React
				key={react_key[r]}
				type={r === react}
				count={poll[r]}
				on:click={() => {
					if (react > 0) poll[react]--;
					if (r === react) {
						react = 0;
					} else {
						react = r;
						poll[react]++;
					}
				}}
			/>
		{/each}
	</form>
{:else}
	<div class="row gap-5">
		{#each poll_react as r (r)}
			<React key={react_key[r]} count={poll[r]} />
		{/each}
	</div>
{/if}
