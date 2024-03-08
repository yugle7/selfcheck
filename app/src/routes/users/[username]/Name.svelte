<script>
	import { getColor } from '$lib/show/data';

	export let user;

	const { position, username } = user;
	const style = `color: ${getColor(position)}`;
</script>

<h1 class="center" {style}>{username}</h1>
