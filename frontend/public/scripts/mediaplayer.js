const btnPlay = document.getElementById("btn-play");
const btnBackward = document.getElementById("btn-backward");
const btnForward = document.getElementById("btn-forward");
const btnShuffle = document.getElementById("btn-shuffle");
const iconMode = document.getElementById("mode-icon");
const seekBar = document.getElementById("seekBar");
const labelCurrentTime = document.getElementById("lbl-current-time");
const labelTotalTime = document.getElementById("lbl-total-time");
const labelSongTitle = document.getElementById("lbl-song-title");
const labelSongArtist = document.getElementById("lbl-song-artist");
const audioElement = document.createElement("audio");

class MediaController {
  constructor() {
    this.songs = [];
    this.currentIndex = 0;
    this.mode = 0;
  }
  setSongs(songs) {
    this.songs = songs;
  }

  getCurrentSongIndex() {
    return this.currentIndex;
  }
  getCurrentSong() {
    return this.songs[this.currentIndex];
  }
  next() {
    const mode = this.getMode();
    if (mode == 0) {
      this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    } else if (mode == 1) {
    } else {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    }
  }
  prev() {
    const mode = this.getMode();
    if (mode == 0) {
      const nextIndex =
        this.currentIndex - 1 == -1
          ? this.songs.length - 1
          : this.currentIndex - 1;
      this.currentIndex = nextIndex;
    } else if (mode == 1) {
    } else {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    }
  }

  changeMode() {
    this.mode++;
    return this.mode % 3;
  }
  getMode() {
    return this.mode % 3;
  }

  changeSong(songId) {
    this.currentIndex = this.songs.findIndex((item) => item.id == songId);
    return this.currentIndex;
  }
}

const mediaPlayer = new MediaController();

btnPlay.addEventListener("click", () => {
  const { paused, currentTime } = audioElement;
  if (paused) {
    if (currentTime == 0) {
      audioElement.src = mediaPlayer.getCurrentSong().src;
    }
    audioElement.play();
    btnPlay.textContent = "Pause";
  } else {
    audioElement.pause();
    btnPlay.textContent = "Play";
  }
});

btnForward.addEventListener("click", () => {
  if (audioElement.played) {
    audioElement.pause();
  }
  mediaPlayer.next();
  audioElement.src = mediaPlayer.getCurrentSong().src;
  audioElement.play();
  btnPlay.textContent = "Pause";
});

btnBackward.addEventListener("click", () => {
  if (audioElement.played) {
    audioElement.pause();
  }
  mediaPlayer.prev();
  audioElement.src = mediaPlayer.getCurrentSong().src;
  audioElement.play();
  btnPlay.textContent = "Pause";
});

btnShuffle.addEventListener("click", () => {
  const mode = mediaPlayer.changeMode();
  if (mode == 0) {
    iconMode.className = "fas fa-retweet";
  } else if (mode == 1) {
    iconMode.className = "fas fa-repeat-1";
  } else {
    iconMode.className = "fas fa-random";
  }
});

seekBar.addEventListener("input", () => {
  const { duration } = audioElement;
  audioElement.currentTime = (seekBar.value / 100) * duration;
});

audioElement.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audioElement;
  labelCurrentTime.innerText = formatTime(currentTime);
  seekBar.value = Math.floor((currentTime / duration) * 100.0);
});

audioElement.addEventListener("loadedmetadata", () => {
  const { src, duration } = audioElement;
  labelTotalTime.innerText = formatTime(duration);
  console.log(mediaPlayer.getCurrentSong());
  labelSongArtist.innerText = mediaPlayer.getCurrentSong().artist;
  labelSongTitle.innerText = mediaPlayer.getCurrentSong().name;
});

audioElement.addEventListener("ended", () => {
  if (audioElement.played) {
    audioElement.pause();
  }
  mediaPlayer.next();
  audioElement.src = mediaPlayer.getCurrentSong().src;
  audioElement.play();
  btnPlay.textContent = "Pause";
});
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function changeSong(id) {
  if (audioElement.played) {
    audioElement.pause();
  }
  mediaPlayer.changeSong(id);
  audioElement.src = mediaPlayer.getCurrentSong().src;
  audioElement.play();
  btnPlay.textContent = "Pause";
}
