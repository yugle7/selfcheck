<script>
	import { enhance } from '$app/forms';
	import { getStatuses, poll_status } from '../data';

	export let poll;
	export let profile;

	$: statuses = getStatuses(profile, poll);
</script>

<form method="post" action="?/status" class="row gap-10 wrap" use:enhance>
	<input type="hidden" bind:value={poll.status} name="status" id="status" />

	<span>{poll_status[poll.status]}</span>

	{#if statuses.length > 0}
		&rarr;
		{#each statuses as s (s)}
			<button class="link" on:click={() => (poll.status = s)}>
				{poll_status[s]}
			</button>
		{/each}
	{/if}
</form>
