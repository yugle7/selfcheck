import PocketBase from 'pocketbase'
import { writable } from "svelte/store";

import { PUBLIC_PB_URL } from '$env/static/public'

export const screen = writable(null);
export const params = writable({});
export const edited = writable({});
export const search = writable('');
export const create = writable(false);

export const back = writable('');

export const pb = new PocketBase(PUBLIC_PB_URL);
// pb.autoCancellation(false);


export function getUserId() {
    return Date.now().toString().slice(4) + Math.random().toString(36).slice(2);
}


function getCode(s, i) {
    const n = s.charCodeAt(i);
    return n < 58 ? n - 48 : n - 87;
}
function getChar(n) {
    if (n >= 36) {
        n -= 36;
    }
    return String.fromCharCode(n < 10 ? n + 48 : n + 87);
}
export function subId(a, b) {
    let s = '';
    for (let i = 0; i < 15; i++) {
        s += getChar(36 + getCode(a, i) - getCode(b, i));
    }
    return s;
}
export function addId(a, b) {
    let s = '';
    for (let i = 0; i < 15; i++) {
        s += getChar(getCode(a, i) + getCode(b, i));
    }
    return s;
}

export function getAuthor(user) {
    const { username, position } = user;
    return { username, position };
}

export function getPoll(poll) {
    const { title, text, categories, status } = poll;
    return { title, text, categories, status };
}

export function getReply(message) {
    const { id, author_id, author, text } = message;
    return { id, author_id, author, text };
}