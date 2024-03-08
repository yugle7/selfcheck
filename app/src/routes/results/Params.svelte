<script>
	import { poll_status, poll_sort, poll_category } from '../polls/data';

	import Search from '$lib/view/Search.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';

	export let profile;
</script>

<Search key="search" title="Поиск" />

<Select key="category" labels={poll_category} />

{#if profile && profile.role >= 2}
	<Radio key="status" labels={poll_status} />
{/if}

<Radio key="sort" labels={poll_sort} />
