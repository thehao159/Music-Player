// Functions
function appPlay() {
    isPause = false;
    dashboard.classList.add('playing');
}

function appPause() {
    isPause = true;
    dashboard.classList.remove('playing');
}

function progressToPercent(currentTime, duration) {
    return Math.floor(currentTime * 100 / duration);
}

function percentToTime(percent, duration) {
    return Math.floor(percent * duration / 100);
}

function changeProgressSlider(currentTime, progressPercent) {
    progress.value = progressPercent * 10;
    progress.style.setProperty('--background-gradient', `linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) ${progressPercent}%, #494545 ${progressPercent}%, #494545 100%)`);
    progress.style.setProperty('--content-after', `'${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}'`);
}

// Handle events
function handleControlbtn() {
    // Main btn
    $('.control__main').addEventListener('click', () => {
        if(isPause) {
            audio.play();
        } else {
            audio.pause();
        }
    });
}

function handleAudio() {
    let duration = 0;

    audio.onloadeddata = () => {
        duration = audio.duration;
        progress.style.setProperty('--content-before', `'${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}'`);
    };

    audio.onplay = appPlay;

    audio.onpause = appPause;

    audio.ontimeupdate = () => {
        const currentTime = audio.currentTime;

        if(duration) {
            const progressPercent =  progressToPercent(currentTime, duration);
            changeProgressSlider(currentTime, progressPercent);
        }
    };
}

function handleSlider() {
    let currentIsPause = false;

    progress.onmousedown = holdThumb;
    progress.ontouchstart = holdThumb;

    progress.onmouseup = releaseThumb;
    progress.ontouchend = releaseThumb;
    
    progress.oninput = () => {
        const rangeLength = progress.value / 10;
        const currentTime = percentToTime(rangeLength, audio.duration);

        audio.currentTime = currentTime;
        changeProgressSlider(currentTime, rangeLength);
    };

    function holdThumb() {
        currentIsPause = isPause;
        audio.pause();
    }

    function releaseThumb() {
        if(!currentIsPause){
            appPlay();
            audio.play();
        }
    }
}

function handleEvents() {
    handleControlbtn();
    handleAudio();
    handleSlider();
}

export default handleEvents;