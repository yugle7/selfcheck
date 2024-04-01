<script>
	import { enhance, applyAction } from '$app/forms';

	import { likes } from '$lib';

	import React from '$lib/show/React.svelte';

	export let poll;
	export let profile;

	let { react, id } = poll;
</script>

{#if profile}
	<form class="row gap-5" method="post" action="/polls?/react" use:enhance={() => applyAction}>
		<input type="hidden" value={id} name="poll_id" id="poll_id" />
		<input type="hidden" value={react} name="react" id="react" />

		{#each likes as r (r)}
			<React
				react={r}
				state={r === react}
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
		{#each likes as r (r)}
			<React react={r} count={poll[r]} />
		{/each}
	</div>
{/if}
