import {defineStore} from "pinia";

export const songStore = defineStore('songStore', {
    state: () => ({
        isPlaying: false,
        audio: null,
        currentSong: null,
        currentPlaylist: null,
    }),
    actions: {
        loadSong(song, playlist) {
            this.currentSong = song
            this.currentPlaylist = playlist

            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            }

            this.audio = new Audio()
            this.audio.src = encodeURI(song.chemin)

            this.audio.addEventListener('canplay', () => {
                this.isPlaying = true;
                this.audio.play();
            });
        },
        playPauseSong() {
            if (this.audio.paused) {
                this.isPlaying = true
                this.audio.play()
            } else {
                this.isPlaying = false
                this.audio.pause()
            }
        },
        playPauseThis(song, playlist) {
            if(!this.audio || !this.audio.src || (this.currentSong.mid !== song.mid)){
                this.loadSong(song,playlist)
                return
            }
            this.playPauseSong()
        },

        previousSong(currentSong) {
            if( currentSong.position === 0) {
                let song = this.currentPlaylist.songs[this.currentPlaylist.songs.length - 1]
                this.loadSong(song, this.currentPlaylist)
            } else {
                let song = this.currentPlaylist.songs[currentSong.position - 1]
                this.loadSong(song, this.currentPlaylist)
            }
        },

        nextSong(currentSong) {
            if (currentSong.position === (this.currentPlaylist.songs.length - 1)) {
                let song = this.currentPlaylist.songs[0]
                this.loadSong(song, this.currentPlaylist)
            } else {
                let song = this.currentPlaylist.songs[currentSong.position + 1]
                this.loadSong(song, this.currentPlaylist)
            }
        },

        playFromFirst(playlist) {
            let song = playlist.songs[0]
            this.loadSong(song, playlist)
        },

        resetState() {
            this.isPlaying = false
            this.audio = null
            this.currentSong = null
            this.currentPlaylist = null
        }
    },
    persist: true,
})