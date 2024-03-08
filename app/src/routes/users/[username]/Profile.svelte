<script>
	import { user_role } from '../data';
	import { enhance } from '$app/forms';

	import ToRole from './ToRole.svelte';

	import Name from './Name.svelte';
	import Contacts from './Contacts.svelte';
	import Link from '$lib/show/Link.svelte';

	export let profile;

	const { role, email, fullname, contacts, friends, polls, discussions } = profile;
</script>

<div class="col scroll gap-40 padding-20 center">
	<div class="col gap-10">
		<Name user={profile} />

		{#if fullname}<h2>{fullname}</h2>{/if}

		{#if email}{email}{/if}
		{#if contacts}<Contacts {contacts} />{/if}

		{#if role >= 2}
			<ToRole {profile} />
		{:else}
			<span>{user_role[role]}</span>
		{/if}
	</div>

	{#if friends || polls || discussions}
		<div class="row gap-20 monospace">
			<Link href="/users?friend=1" count={friends} key="users" />

			<Link href="/polls?author_id={profile.id}" count={polls} key="polls" />
			<Link href="/discussions?author_id={profile.id}" count={discussions} key="discussions" />
		</div>
	{/if}

	<div class="col gap-10">
		<a href="/change">Обновить данные</a>

		<form method="post" action="?/email_visibility" use:enhance>
			<input
				type="hidden"
				bind:value={profile.emailVisibility}
				name="email_visibility"
				id="email_visibility"
			/>
			<button class="link center" type="submit">
				{#if profile.emailVisibility}
					Скрыть почту от всех
				{:else}
					Сделать почту видимой всем
				{/if}
			</button>
		</form>
	</div>

	<div class="col gap-10">
		<a href="/create/discussion">Начать новое общение</a>
		<a href="/create/poll">Создать опрос</a>
	</div>

	<form method="post" action="?/logout" use:enhance>
		<button class="link" type="submit">Выйти</button>
	</form>
</div>
