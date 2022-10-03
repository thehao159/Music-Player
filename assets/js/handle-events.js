import handleRenderDashboard from './render-dashboard.js';
import { NUMBER_OF_SONGS } from './get-data.js';

// Functions
// Tính phần trăm theo tiến độ
function timeToPercent(currentTime, duration) {
    return Math.floor(currentTime * 100 / duration);
}

// Từ tiến độ quy đổi phần trăm
function percentToTime(percent, duration) {
    return Math.floor(percent * duration / 100);
}

// Thay đổi tiến độ của bài hát trên thanh progress
function changeProgressSlider(currentTime, progressPercent) {
    progress.value = progressPercent * 10;
    progress.style.setProperty('--background-gradient', `linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) ${progressPercent}%, #494545 ${progressPercent}%, #494545 100%)`);
    progress.style.setProperty('--content-after', `'${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}'`);
}

// Chuyển bài hát tiếp theo (thay đổi index và thay đổi bàt hát)
function nextSong() {
    currentIndex++;
    if(currentIndex >= NUMBER_OF_SONGS) {
        currentIndex = 0;
    }
    handleRenderDashboard(currentIndex);
}

// Chuyển bài hát lùi về (thay đổi index và thay đổi bàt hát)
function prevSong() {
    currentIndex--;
    if(currentIndex < 0) {
        currentIndex = NUMBER_OF_SONGS - 1;
    }
    handleRenderDashboard(currentIndex);
}

// Bài hát ngẫu nhiên
function randomSong() {
    let randomNumber = currentIndex;

    while (randomNumber === currentIndex) {
        randomNumber = Math.floor(Math.random() * NUMBER_OF_SONGS);
    }
    currentIndex = randomNumber;
    handleRenderDashboard(currentIndex);
}

// Handle events
function handleControlbtn() {
    // Nút Play/Stop (play chạy, stop dừng)
    $('.control__main').addEventListener('click', () => {
        if(isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    // Nút Next (chạy bài kế)
    nextBtn.addEventListener('click', () => {
        if(isRandom) {
            randomSong();
        } else {
            nextSong();
        }
        audio.play();
    });

    // Nút Previous (chạy bài trước)
    $('.control__prev').addEventListener('click', () => {
        if(isRandom) {
            randomSong();
        } else {
            prevSong();
        }
        audio.play();
    });

    // Nút random (bật / tắt random)
    randomBtn.addEventListener('click', () => {
        isRandom = !isRandom;
        randomBtn.classList.toggle('control__btn--actived', isRandom);
    });

    // Nút lặp (bật / tắt lặp)
    loopBtn.addEventListener('click', () => {
        isLoop = !isLoop;
        loopBtn.classList.toggle('control__btn--actived', isLoop);
        audio.loop = isLoop;
    });
}

function handleAudio() {
    let duration = 0;

    // Xử lý quay cd
    const spinnerCdAnimation = cdImg.animate(
        [
            {transform: 'rotate(360deg)'}
        ],
        {
            duration: 20000, // thời lượng 1 vòng
            iterations: Infinity // số vòng lặp
        }
    );
    spinnerCdAnimation.pause();

    // Bỏ hết btn trong playlist đang có playing
    // Chuyển btn playing cho bài hát phù hợp ở playlist
    // Lấy thời lượng bài hiện tại render lên dashboard, cho cd về ban đầu
    audio.onloadeddata = () => {
        const playingSong = $('.song__item--playing');
        
        if(playingSong) playingSong.classList.remove('song__item--playing');
        $$('.song__item')[currentIndex].classList.add('song__item--playing');
        
        spinnerCdAnimation.currentTime = 0;
        
        duration = audio.duration;
        progress.style.setProperty('--content-before', `'${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}'`);
    };
    
    // Thay đổi trạng thái play và dashboard ở trạng thái play
    audio.onplay = () => {
        isPlaying = true;
        dashboard.classList.add('playing');
        spinnerCdAnimation.play();
    };

    // Thay đổi trạng thái pause và dashboard ở trạng thái pause
    audio.onpause = () => {
        isPlaying = false;
        dashboard.classList.remove('playing');
        spinnerCdAnimation.pause();
    };

    // Khi audio ở trạng thái chạy thì thay đổi thanh progress
    audio.ontimeupdate = () => {
        const currentTime = audio.currentTime;

        if(duration) {
            const progressPercent =  timeToPercent(currentTime, duration);
            changeProgressSlider(currentTime, progressPercent);
        }
    };
    
    // Khi hết bài kt loop, nếu không thì auto next
    audio.onended = () => {
        if(!isLoop) {
            nextBtn.click();
        }
    };
}

function handleSlider() {
    let currentIsPlaying = true;
    
    function holdThumb() {
        currentIsPlaying = isPlaying;
        audio.pause();
    }

    function releaseThumb() {
        if(currentIsPlaying){
            audio.play();
        }
    }

    // Khi giữ nút tua
    progress.onmousedown = holdThumb;
    progress.ontouchstart = holdThumb;

    // Khi thả nút tua
    progress.onmouseup = releaseThumb;
    progress.ontouchend = releaseThumb;
    
    // Khi kéo nút tua thay đổi giá trị của input và thanh progress
    progress.oninput = () => {
        const rangeLength = progress.value / 10;
        const currentTime = percentToTime(rangeLength, audio.duration);

        audio.currentTime = currentTime;
        changeProgressSlider(currentTime, rangeLength);
    };
}

function handlePlaylist() {
    // Ấn ngẫu nhiên bài hát nào đó
    // thì sẽ lấy index của bài từ attribute data-index
    // thành currentIndex và render lên dashboard
    $('.song__list').addEventListener('click', e => {
        const songClicked = e.target.closest('.song__item:not(.song__item--playing)');

        if(songClicked) {
            currentIndex = Number(songClicked.dataset.index);
            handleRenderDashboard(currentIndex);
            audio.play();
        }
    });
}

function handleEvents() {
    handleControlbtn();
    handleAudio();
    handleSlider();
    handlePlaylist();
}

export default handleEvents;