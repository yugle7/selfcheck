import { fail, redirect } from "@sveltejs/kit";
import { getAuthor } from "$lib";


export const actions = {
    default: async ({ request, locals }) => {
        const pb = locals.pb;

        const profile = pb.authStore.model;
        if (!profile) throw redirect(303, '/login');

        const data = await request.formData();
        const username = data.get('username') || profile.username;

        if (username !== profile.username) {
            try {
                await pb.collection('users').getFirstListItem(`username="${username}"`);
                return fail(409, { errors: { username: 'уже есть пользователь с таким логином' } });
            } catch (err) {
                console.log(err.message);
            }
        }
        const fullname = data.get('fullname') || null;

        let contacts = data.get('contacts');
        contacts = contacts ? contacts.split('\n') : null;

        const valid = username === profile.username;

        if (
            !valid || fullname !== profile.fullname ||
            JSON.stringify(contacts) !== JSON.stringify(profile.contacts)
        ) {
            await pb.collection('users').update(profile.id, {
                username,
                fullname,
                contacts,
                valid: profile.valid && valid
            });
        }

        if (!valid) {
            const actions = [];

            profile.username = username;
            const { discussions, polls } = profile;

            const author = getAuthor(profile);
            {
                const res = await pb.collection('talks').getFullList({ filter: `user_id="${profile.id}"` });
                res.forEach(u => actions.push(pb.collection('talks').update(u.id, { user: author })));
            }
            {
                const res = await pb.collection('messages').getFullList({ filter: `author_id="${profile.id}"` });
                res.forEach(m => actions.push(pb.collection('messages').update(m.id, { author })));
            }
            if (discussions) {
                const res = await pb.collection('discussions').getFullList({ filter: `author_id="${profile.id}"` });
                res.forEach(d => actions.push(pb.collection('discussions').update(d.id, { author })));
            }
            if (polls) {
                const res = await pb.collection('polls').getFullList({ filter: `author_id="${profile.id}"` });
                res.forEach(p => actions.push(pb.collection('polls').update(p.id, { author })));
            }

            await Promise.all(actions);
        }

        redirect(303, `/users/${username}`);
    }
}