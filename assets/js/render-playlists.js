import { getAllSongs } from './get-data.js';

function renderPlaylists() {
    const html = getAllSongs().map((song) => `
        <div class="song__item">
            <div class="song__avatar">
                <div class="song__avatar-img" style="background-image: url('${song.avatar}');"></div>
            </div>
            <div class="song__info">
                <div class="song__name">${song.name}</div>
                <div class="song__singer">${song.singer}</div>
            </div>
            <div class="song__status">
                <div class="song__btn">
                    <i class="fa-solid fa-play song__icon song__play-icon"></i>
                    <i class="fa-solid fa-pause song__icon song__pause-icon"></i>
                </div>
            </div>
        </div>
    `);

    $('.song__list').innerHTML = html.join('');
}

export default renderPlaylists;