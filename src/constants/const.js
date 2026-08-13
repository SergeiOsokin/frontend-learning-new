// require('dotenv').config();
// import dotenv from 'dotenv';
// dotenv.config();

// export const host = process.env.HOST || 'http://localhost:3000/api'

// export const host = 'https://learnew.ru/api'
export const host = 'http://localhost:3000/api'
// export const hostWS = 'http://localhost:3001'

export const doments = [
    // '@gmail.com',
    '@mail.ru',
    '@xmail.ru',
    '@yandex.ru',
    '@bk.ru',
    '@list.ru',
    // '@icloud.com',
    '@inbox.ru',
    // '@yahoo.com',
    // '@outlook.com'
]

export const STEP = {
    JOIN: 'join',
    LEAVE: 'leave',
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER: 'add-peer',
    REMOVE_PEER: 'remove-peer',
    RELAY_SDP: 'relay-sdp',
    RELAY_ICE: 'relay-ice',
    ICE_CANDIDATE: 'ice-candidate',
    SESSION_DESCRIPTION: 'session-description',
};