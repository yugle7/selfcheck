<script>
	import { poll_sort, poll_category } from '../polls/data';

	import Search from '$lib/view/Search.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';

</script>

<Search key="search" title="Поиск" />

<Select key="category" labels={poll_category} />

<Radio key="sort" labels={poll_sort} />
