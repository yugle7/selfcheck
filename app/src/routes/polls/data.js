export const default_params = {
    sort: '-changed',
    status: 5
}

export const poll_sort = {
    '-changed': 'Новые',
    'changed': 'Старые',
    '-like': 'Лучшие'
};

export const icon_type = ['radio', 'box'];

export const poll_status = [
    'Черновик',
    'Предложен',
    'Архив',
    'Дубль',
    'Отбор',
    'Выложен'
];

export const poll_category = [
    'Гинекология',
    'Стомотология',
    'Хирургия',
    'Гастроэнтерология'
];


export function getStatuses(profile, poll) {
    const { like, status } = poll;
    const { role } = profile;

    switch (status) {
        case 1:
            return role >= 2 ? [0, 2, 3, 4] : [0, 2, 3];
        case 0:
        case 2:
        case 3:
            return [1];
        case 4:
            return role >= 3 || like > 80 ? [1, 5] : [1];
        case 5:
            return role >= 3 || like < 50 ? [1] : [];
        default:
            return [];
    }
}