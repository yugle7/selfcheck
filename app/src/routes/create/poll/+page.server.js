import { redirect } from "@sveltejs/kit";
import { getAuthor } from "$lib";

const createAnswer = async (pb, answer, index, question_id, poll_id) => {
    answer.index = index;
    await pb.collection('poll_answers').create({ ...answer, question_id, poll_id });
};

const createQuestion = async (pb, question, index, poll_id) => {
    const { answers } = question;
    
    question.index = index;
    question.answers = answers.length;

    const { id } = await pb.collection('poll_questions').create({ ...question, poll_id });
    await Promise.all(answers.map((a, i) => createAnswer(pb, a, i, id, poll_id)));
};

const createResult = async (pb, result, index, poll_id) => {
    result.index = index;
    await pb.collection('poll_results').create({ ...result, poll_id });
};

export const actions = {
    default: async ({ request, locals }) => {
        const pb = locals.pb;

        const profile = pb.authStore.model;
        if (!profile) throw redirect(303, '/login');

        const data = await request.formData();

        const questions = JSON.parse(data.get('questions'));
        const results = JSON.parse(data.get('results'));

        const { id } = await pb.collection('polls').create({
            author_id: profile.id,
            author: getAuthor(profile),
            title: data.get('title'),
            about: data.get('about'),
            categories: data.getAll('categories'),
            questions: questions.length,
            changed: new Date()
        });

        await Promise.all([
            ...questions.map((q, i) => createQuestion(pb, q, i, id)),
            ...results.map((r, i) => createResult(pb, r, i, id)),
            pb.collection('users').update(profile.id, { 'polls+': 1 })
        ]);

        redirect(303, `/polls/${id}`);
    }
}