<script>
	import { getColor } from '$lib/show/data';
	import { user_role } from './data';

	export let user;
	export let params;

	const { username, position, role, friend } = user;

	const style = `color: ${getColor(position)}`;

	const getSubtitle = () => {
		const names = [];
		if (params.role == null) names.push(user_role[role]);
		if (!params.friend && friend) names.push('Друг');
		return names.join(' – ');
	};
</script>

<a href="/users/{username}">
	<div>
		<span class="username font-20" {style}>{username}</span>
		<span class="font-14">{getSubtitle()}</span>
	</div>
</a>

<style>
	a {
		opacity: 90%;
	}
	.username {
		padding: 0 5px;
	}
	div {
		padding: 20px;
		margin: 0 auto;
		max-width: 600px;
	}
</style>
