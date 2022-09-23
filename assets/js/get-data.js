import songs from '../data/data.js';

export function getAllSongs() {
    return songs;
};

export function getSong(index) {
    return songs[index];
};