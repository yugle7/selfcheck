import { redirect } from '@sveltejs/kit';

async function loadResults(pb, profile) {
    const res = await pb.collection('user_results').getFullList({
        filter: `profile_id="${profile.id}"`,
        expand: 'poll_id',
        sort: '-created'
    });

    const results = {};
    res.forEach(r => {
        const { id, text, poll_id, expand, created } = r;
        const { title, about, status, categories } = expand.poll_id;

        if (!results[poll_id]) results[poll_id] = { id, text, created, title, about, status, categories };
    });
    return Object.values(results);
}

export async function load({ locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    if (!profile) throw redirect(303, '/login');

    return {
        results: loadResults(pb, profile),
        profile
    };
}
