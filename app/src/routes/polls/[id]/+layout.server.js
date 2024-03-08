import { addId } from "$lib";
import { error } from "@sveltejs/kit";

async function getReact(pb, profile, poll) {
    const id = addId(poll.id, profile.id);
    try {
        const { react } = await pb.collection('poll_reacts').getOne(id);
        return react;
    } catch (err) {
        console.log(err.message);
    }
    return 0;
}
async function loadPoll(pb, profile, id) {
    try {
        const res = await pb.collection('polls').getOne(id);

        if (profile) {
            res.react = await getReact(pb, profile, res);
        }
        return res;

    } catch (err) {
        console.log(err.message);
        error(404, 'нет такого опроса')
    }
}

async function loadQuestions(pb, id) {
    const data = {};

    const questions = await pb.collection('questions').getFullList({ filter: `poll_id="${id}"`, sort: 'index' });
    questions.forEach(({ id }) => data[id] = []);

    const answers = await pb.collection('answers').getFullList({ filter: `poll_id="${id}"`, sort: 'index' });
    answers.forEach(({ id, question_id, text, weight }) => data[question_id].push({ id, text, weight }));

    return questions.map(({ id, text, note, type }) => ({ id, text, note, type, answers: data[id] }));
}

async function loadResults(pb, id) {
    const results = await pb.collection('results').getFullList({ filter: `poll_id="${id}"`, sort: 'index' });
    return results.map(({ id, text, weight }) => ({ id, text, weight }));
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const { id } = params;

    return {
        poll: await loadPoll(pb, profile, id),
        results: await loadResults(pb, id),
        questions: await loadQuestions(pb, id),
        profile
    };
}
