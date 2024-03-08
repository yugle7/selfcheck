import { error } from "@sveltejs/kit";


async function loadQuestions(pb, id) {
    const data = {};
    const questions = [];

    const res = await pb.collection('user_answers').getFullList({
        filter: `result_id="${id}"`,
        expand: 'question_id'
    });
    res.forEach(a => {
        const { expand } = a;
        const { index, text, note } = expand.question_id;
        if (!data[index]) {
            data[index] = [];
            questions.push({ index, text, note, answers: data[index] });
        }
        data[index].push({ text: a.text });
    });
    questions.sort((a, b) => a.index - b.index);
    return questions;
}


async function loadResult(pb, id) {
    try {
        const res = await pb.collection('user_results').getOne(id, { expand: 'poll_id' });

        const { poll_id, expand } = res;
        const { title, about, categories } = expand.poll_id;

        const questions = await loadQuestions(pb, id);
        return { id, poll_id, title, about, categories, questions };

    } catch (err) {
        console.log(err.message);
        error(404, 'нет такого результата')
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const result = await loadResult(pb, params.id);
    return { result, profile };
}
