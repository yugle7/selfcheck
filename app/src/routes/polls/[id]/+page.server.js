import { addId, getAuthor } from "$lib";

async function loadReacts(pb, talk_id) {
    const res = await pb.collection('reacts').getFullList({
        filter: `talk_id="${talk_id}"`
    });
    const reacts = {};
    res.forEach((r) => (reacts[r.message_id] = r.react));
    return reacts;
}

async function loadTalk(pb, profile_id, chat_id) {
    const id = addId(profile_id, chat_id);
    let talk;

    try {
        talk = await pb.collection('talks').getOne(id);
        if (talk.message_id) await pb.collection('talks').update(id, { message_id: null });
        talk.reacts = await loadReacts(pb, id);
    } catch (err) {
        console.log(err.message);

        console.log(id, profile_id, chat_id);
        talk = await pb.collection('talks').create({
            id,
            profile_id,
            chat_id,
            deleted: true
        });
        talk.reacts = {};
    }
    return talk;
}

async function loadMessages(pb, chat_id) {
    return await pb.collection('messages').getFullList({
        filter: `chat_id="${chat_id}"`,
        sort: 'created'
    });
}

async function loadChat(pb, poll) {
    const { id, title } = poll;
    let chat;

    try {
        chat = await pb.collection('chats').getOne(id);
        chat.messages = await loadMessages(pb, id);
    } catch (err) {
        console.log(err.message);

        chat = await pb.collection('chats').create({
            id,
            title,
            type: 2,
            changed: new Date()
        });
        chat.messages = [];
    }
    return chat;
}

export async function load({ parent, url, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    if (url.searchParams.get('type') !== '2') return {};

    const { poll } = await parent();
    if (!poll) return {};

    const chat = await loadChat(pb, poll)
    if (!profile) return { chat };

    const talk = await loadTalk(pb, profile.id, chat.id);
    return { chat, talk }
}

const sendMessage = async (pb, profile, chat_id) => {
    const author = getAuthor(profile);
    const text = 'Исправил';

    try {
        const { id, updated } = await pb.collection('messages').create({
            text,
            author_id: profile.id,
            author,
            chat_id
        });

        const { sent } = await pb.collection('chats').update(chat_id, {
            'sent+': 1,
            sender_id: profile.id,
            message: { text, author },
            message_id: id,
            changed: updated
        });
        {
            const id = addId(profile.id, chat_id);
            await pb.collection('talks').update(id, {
                read: sent,
                deleted: false
            });
        }
    } catch (err) {
        console.log(err.message);
    }
};

const editAnswer = async (pb, answer, index, question_id, poll_id) => {
    const { id } = answer;
    delete answer.id;

    answer.index = index;

    if (id.length < 15) {
        console.log({ ...answer, question_id, poll_id });
        await pb.collection('answers').create({ ...answer, question_id, poll_id });
    } else {
        await pb.collection('answers').update(id, answer);
    }
};

const editQuestion = async (pb, question, index, poll_id) => {
    let { id, answers } = question;
    delete question.id;

    question.answers = answers.length;
    question.index = index;

    if (id.length < 15) {
        const res = await pb.collection('questions').create({ ...question, poll_id });
        id = res.id;
    } else {
        await pb.collection('questions').update(id, question);
    }
    await Promise.all(answers.map((a, i) => editAnswer(pb, a, i, id, poll_id)));
};

const editResult = async (pb, result, index, poll_id) => {
    const { id } = result;
    delete result.id;

    result.index = index;

    if (id.length < 15) {
        await pb.collection('results').create({ ...result, poll_id });
    } else {
        await pb.collection('results').update(id, result);
    }
};

export const actions = {
    edit: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();
        const { id } = params;

        const categories = data.getAll('categories');
        if (categories.length === 0) return;

        const questions = JSON.parse(data.get('questions'));
        const results = JSON.parse(data.get('results'));

        const poll = {
            title: data.get('title'),
            about: data.get('about'),
            categories,
            questions: questions.length,
            changed: new Date()
        }
        await Promise.all([
            sendMessage(pb, profile, id),
            pb.collection('polls').update(id, poll),
            ...questions.map((q, i) => editQuestion(pb, q, i, id)),
            ...results.map((r, i) => editResult(pb, r, i, id))
        ]);
    },
    send: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();
        const { id } = params;

        const result = JSON.parse(data.get('result'));
        result.poll_id = id;
        if (profile) result.profile_id = profile.id;
        const res = await pb.collection('user_results').create(result);

        const answers = JSON.parse(data.getAll('answers'));
        await Promise.all(
            answers.map((answer) =>
                pb.collection('user_answers').create({
                    ...answer,
                    poll_id: id,
                    result_id: res.id
                })
            )
        );
    },
    status: async ({ request, params, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();
        const status = +data.get('status');

        await pb.collection('polls').update(params.id, { status });
    }
}