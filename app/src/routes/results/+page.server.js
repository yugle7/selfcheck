import { redirect } from '@sveltejs/kit';

async function loadResults(pb, profile_id) {
    const res = await pb.collection('results').getFullList({
        filter: `profile_id="${profile_id}"`,
        expand: 'poll_id',
        sort: '-updated'
    });

    return res.map(result => {
        const { id, text, expand, updated } = result;
        const { title, about, status, categories } = expand.poll_id;
        return { id, text, updated, title, about, status, categories };
    });
}

export async function load({ locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    if (!profile) throw redirect(303, '/login');

    return { profile, results: loadResults(pb, profile.id) };
}
