import { addId } from '$lib';
import { default_params } from './data';

async function loadReacts(pb, profile) {
    const res = await pb.collection('poll_reacts').getFullList({
        filter: `profile_id="${profile.id}"`
    });
    if (res.length) {
        const reacts = {};

        res.forEach(({ poll_id, react }) => (reacts[poll_id] = react));
        return reacts;
    }
}

async function loadPolls(pb, profile, params) {
    const { sort, category, status, author_id } = params;

    const filters = [];
    if (status != null) filters.push(`status=${status}`);

    if (category != null) filters.push(`categories~'"${category}"'`);
    if (author_id) filters.push(`author_id="${author_id}"`);

    const polls = await pb.collection('polls').getFullList({
        filter: filters.join('&&'),
        sort
    });

    if (profile) {
        const reacts = await loadReacts(pb, profile);
        if (reacts) polls.forEach(p => (p.react = reacts[p.id]));
    }
    return polls;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const params = { ...default_params };
    for (const key of ['category', 'author_id']) params[key] = url.searchParams.get(key);

    const sort = url.searchParams.get('sort');
    if (sort) params.sort = sort;

    if (profile) {
        const status = url.searchParams.get('status');
        if (status != null && profile.role >= 2) params.status = parseInt(status);
    }
    return {
        polls: loadPolls(pb, profile, params),
        profile,
        params
    };
}

export const actions = {
    react: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const poll_id = data.get('poll_id');
        const react = data.get('react');

        const id = addId(profile.id, poll_id);

        try {
            const res = await pb.collection('poll_reacts').getOne(id);

            if (res.react === react) return;
            await pb.collection('poll_reacts').update(id, { react });

            const data = {};
            if (res.react > 0) data[res.react + '-'] = 1;
            if (react > 0) data[react + '+'] = 1;

            await pb.collection('polls').update(poll_id, data);

        } catch (err) {
            console.log(err.message);

            const data = {};
            data[react + '+'] = 1;

            await pb.collection('polls').update(poll_id, data);

            await pb.collection('poll_reacts').create({
                id,
                react,
                profile_id: profile.id,
                poll_id
            });
        }

    }
}