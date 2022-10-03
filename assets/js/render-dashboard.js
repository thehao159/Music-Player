import { getSong } from "./get-data.js";

function handleRenderDashboard(index) {
    const song = getSong(index);

    $('.header__song').textContent = song.name;
    $('.header__singer').textContent = song.singer;
    cdImg.style.backgroundImage = `url('${song.avatar}')`;
    $('#audio').src = song.path;
}

export default handleRenderDashboard;