import { writable } from "svelte/store";

export const show = writable(null);
export const look = writable(null);
export const down = writable(null);
export const find = writable(null);
export const edit = writable(null);
export const menu = writable(null);

export const scroll = writable(null);
export const select = writable(null);

export const reply = writable(null);

export const message_react = [1, 2, 3, 4, 5, 6];

export const react_color = {
    'like': 'green',
    'dislike': 'red',
    'smile': 'yellow',
    'sad': 'blue',
    'love': 'pink',
    'serious': 'brown',
};

export const chat_type = [
    'Личная переписка',
    'Совместное общение',
    'Обсуждаю опрос',
    'Смотрю результат',
    'Проверяю результат',
];

export function isClick(window) {
    let selection = window.getSelection();
    if (!selection) return true;
    try {
        let range = selection.getRangeAt(0);
        return range.startOffset == range.endOffset;
    } catch (err) {
        console.log(err.message);
        return true;
    }
}

export function parseUsernames(text) {
    return text.match(/(^|\s)@[a-z]{3,}\b/g)?.map((u) => u.substr(u[0] === '@' ? 1 : 2)) || [];
}

export function getTitle(chat, talk) {
    return chat.type === 0 ? talk.user.username : chat.title;
}

export function getUrl(chat) {
    const { id, type, talk } = chat;
    let url;

    if (type === 0) url = `/users/${talk.user.username}`;
    else if (type === 1) url = `/discussions/${id}`;
    else if (type === 2) url = `/polls/${id}`
    else if (type === 3) url = `/results/${id}`

    return `${url}?type=${type}`
}
