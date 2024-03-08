<script>
	import { user_role } from '../data';

	import Link from '$lib/show/Link.svelte';

	import Name from './Name.svelte';
	import Role from './Role.svelte';
	import Contacts from './Contacts.svelte';
	import Friend from './Friend.svelte';

	export let user;
	export let chat = false;
	export let profile;

	const { role, email, fullname, contacts, polls, discussions, results } = user;
	const counts = profile && profile.role >= 2 && results;
</script>

<div class="col scroll gap-40 padding-20 center">
	<div class="col gap-10">
		<Name {user} />
		{#if fullname}<h2>{fullname}</h2>{/if}

		{#if email}{email}{/if}
		{#if contacts}<Contacts {contacts} />{/if}

		{#if profile && profile.role >= 2 && profile.role > user.role}
			<Role {user} />
		{:else}
			<span>{user_role[role]}</span>
		{/if}
	</div>

	{#if polls || discussions || counts}
		<div class="row gap-20 line-0 wrap monospace">
			<Link href="/polls?author_id={user.id}" count={polls} key="polls" />
			<Link href="/discussions?author_id={user.id}" count={discussions} key="discussions" />

			{#if counts}
				<Link href="/results?author_id={user.id}" count={results} key="results" />
			{/if}
		</div>
	{/if}

	{#if profile}
		<div class="col gap-10">
			{#if chat && profile.role}
				<a href="?type=0">Написать лично</a>
			{/if}
			<Friend {user} />
		</div>
	{/if}
</div>
