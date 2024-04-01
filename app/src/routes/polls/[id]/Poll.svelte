<script>
	import Text from '$lib/text/Text.svelte';
	import { enhance, applyAction } from '$app/forms';

	import Question from './Question.svelte';

	import { poll_category } from '../data';
	import { getUserId } from '$lib';
	import Status from './Status.svelte';

	export let poll;
	export let questions;
	export let results;
	export let profile;

	const { title, about, author_id } = poll;
	let disabled = false;

	const getSubtitle = () => {
		let { categories, like } = poll;
		categories = categories.map((c) => poll_category[c]).join(', ');
		const names = [categories];
		if (like) names.push(like);
		return names.join(' – ');
	};

	let error;

	let result;
	let answers;

	const sendResult = () => {
		error = undefined;

		answers = [];
		let weight = 0;

		questions.forEach((q, i) => {
			q.selected = false;
			q.weight = 0;

			q.answers.forEach(({ id, text, weight, selected }) => {
				if (selected) {
					answers.push({ answer_id: id, question_id: q.id, text });

					q.weight += weight;
					q.selected = true;
				}
			});
			if (!error && !q.selected) error = i + 1;
			weight += q.weight;
		});
		if (error) return;

		result = { weight: 0 };
		results.forEach((r) => {
			if (
				(result.weight < weight && result.weight < r.weight) ||
				(weight <= r.weight && result.weight > r.weight)
			) {
				result = r;
			}
		});
		const { id, text } = result;
		result = { result_id: id, text, weight };

		if (!profile) {
			let id = localStorage.getItem('user_id');
			if (!id) {
				id = getUserId();
				localStorage.setItem('user_id', id);
			}
			result.user_id = id;
		}
		error = false;
	};
</script>

{#if error === null}
	<div class="auth">
		<Text text={result.text} />

		{#if !profile}
			<a class="button" href="/login">Войти</a>
			<p class="subtitle">
				Чтобы результат сохранился в вашу историю и можно было потом отслеживать динамику
			</p>
		{/if}

		<button class="button" on:click={() => (error = undefined)}>Вернуться</button>
	</div>
{:else}
	<form
		method="post"
		action="?/send"
		class="col padding-20 gap-40 content-900"
		use:enhance={({ cancel }) => {
			if (error !== false) cancel();
			return async ({ result }) => {
				await applyAction(result);
				error = null;
			};
		}}
	>
		{#if error === false}
			<input type="hidden" name="result" value={JSON.stringify(result)} />
			<input type="hidden" name="answers" value={JSON.stringify(answers)} />
		{/if}

		<div class="col top-20">
			<h1 class="line-1">{title}</h1>
			<span class="subtitle">{getSubtitle()}</span>
			<Text text={about} />
		</div>

		{#each questions as question, i (i)}
			<Question {question} index={i + 1} />
		{/each}

		<div class="row right center gap-15">
			{#if error}
				<span class="failed">
					Hет ответа на {error} вопрос
				</span>
			{/if}
			<button class="button" {disabled} type="submit" on:click={sendResult}>Отправить</button>
		</div>
	</form>

	{#if profile && (profile.role >= 2 || author_id === profile.id)}
		<div class="col padding-20 center gap-20 line-0">
			<Status {poll} {profile} />
			<button class="link center line-0" on:click>Исправить опрос</button>
		</div>
	{/if}
{/if}
