<script setup>
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import PictureInPictureBottomRight from "vue-material-design-icons/PictureInPictureBottomRight.vue";
import SkipBackward from "vue-material-design-icons/SkipBackward.vue";
import SkipForward from "vue-material-design-icons/SkipForward.vue";

import {nextTick, onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {songStore} from "../store/songs.js";
import MusicPlayerVolume from "./MusicPlayerVolume.vue";

const useStore = songStore();
const {audio, currentSong, isPlaying, currentPlaylist} = storeToRefs(useStore);

let isHover = ref(false);
let isSongTimeCurrent = ref(null);
let isSongTimeTotal = ref(null);
let seeker = ref(null);
let seekerContainer = ref(null);
let range = ref(0)

onMounted(async () => {
  if (!audio.value) {
    return;
  }

  if (audio.value) {
    setTimeout(() => {
      timeupdate()
      loadedmetadata()
    }, 300)
  }
  await nextTick();

  if (currentSong.value) {
    seeker.value.addEventListener('change', function () {
      const time = audio.value.duration * (seeker.value.value / 100);
      audio.value.currentTime = time;
    })

    seeker.value.addEventListener('mousedown', function () {
      audio.value.pause();
      isPlaying.value = false;
    })

    seeker.value.addEventListener('mouseup', function () {
      audio.value.play();
      isPlaying.value = true;
    })

    seekerContainer.value.addEventListener('click', function (event) {
      const clickPos = (event.clientX - seekerContainer.value.offsetLeft) / seekerContainer.value.offsetWidth;
      const time = audio.value.duration * clickPos;
      audio.value.currentTime = time;
      seeker.value.value = (100 / audio.value.duration) * audio.value.currentTime;
    })
  }
})


const timeupdate = () => {
  audio.value.addEventListener("timeupdate", function () {
    var minutes = Math.floor(audio.value.currentTime / 60);
    var seconds = Math.floor(audio.value.currentTime - minutes * 60);
    isSongTimeCurrent.value = minutes + ':' + seconds.toString().padStart(2, '0')
    const value = (100 / audio.value.duration) * audio.value.currentTime;
    range.value = value
    seeker.value.value = value;
  });
}

const loadedmetadata = () => {
  audio.value.addEventListener('loadedmetadata', function () {
    const duration = audio.value.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    isSongTimeTotal.value = minutes + ':' + seconds.toString().padStart(2, '0')
  });
}

watch(() => audio.value, () => {
  timeupdate()
  loadedmetadata()
});

watch(() => isSongTimeCurrent.value, (time) => {
  if (time && time === isSongTimeTotal.value) {
    useStore.nextSong(currentSong.value)
  }
});
</script>

<template>
  <div id="MusicPlayer" v-if="audio"
       class="fixed flex items-center justify-between bottom-0 w-full z-50 h-[90px] bg-[#181818] border-t border-t-[#272727]">
    <div class="flex items-center w-1/4">
      <div class="flex items-center ml-4">
        <img class="rounded-sm shadow-2xl" width="55" :src="`https://picsum.photos/id/${currentSong.mid}/300/300`"/>
        <div class="ml-4">
          <div class="text-[14px] text-white hover:underline cursor-pointer">
            {{ currentSong.titre }}
          </div>
          <div class="text-[11px] text-gray-400 hover:underline hover:text-white cursor-pointer">
            {{ currentSong.artiste_nom }}
          </div>
        </div>
      </div>
      <div class="flex items-center ml-8">
        <PictureInPictureBottomRight class="ml-4" fill-color="#FFFFFF" :size="18"/>
      </div>
    </div>
    <div class="max-w-[35%] mx-auto w-2/4 mb-3">
      <div class="flex-col items-center justify-center">
        <div class="flex items-center justify-center h-[30px]">
          <button class="mx-2">
            <SkipBackward fill-color="#FFFFFF" :size="25" @click="useStore.previousSong(currentSong)"/>
          </button>
          <button class="p-1 rounded-full mx-3 bg-white" @click="useStore.playPauseThis(currentSong, currentPlaylist)">
            <Play v-if="!isPlaying" fill-color="#181818" :size="25"/>
            <Pause v-else fill-color="#181818" :size="25"/>
          </button>
          <button class="mx-2">
            <SkipForward fill-color="#FFFFFF" :size="25" @click="useStore.nextSong(currentSong)"/>
          </button>
        </div>
      </div>
      <div class="flex items-center h-[25px]">
        <div v-if="isSongTimeCurrent" class="text-white text-[12px] pr-2 pt-[11px]">{{ isSongTimeCurrent }}</div>
        <div ref="seekerContainer" class="w-full relative mt-2 mb-3" @mouseenter="isHover = true"
             @mouseleave="isHover = false">
          <input type="range" v-model="range" ref="seeker"
                 class="absolute rounded-full my-2 w-full h-0 z-40 appearance-none bg-oppacity-100 focus:outline-none accent-white"
                 :class="{'rangeDotHidden': !isHover}"/>
          <div class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0"
               :style="`width:${range}%;`" :class="isHover ? 'bg-[#005A9C]' : 'bg-white'"/>
          <div class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full"/>
        </div>
        <div v-if="isSongTimeTotal" class="text-white text-[12px] pl-2 pr-2 pt-[11px]">{{ isSongTimeTotal }}</div>

      </div>
    </div>
    <div class="flex items-center w-1/4 justify-end pr-10">
      <MusicPlayerVolume/>
    </div>
  </div>
</template>
<style>
.rangeDotHidden[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  border: none;
}

.rangeDotHidden[type="range"]::-moz-range-thumb {
  appearance: none;
  width: 0;
  height: 0;
  border: none;
}

.rangeDotHidden[type="range"]::-ms-thumb {
  appearance: none;
  width: 0;
  height: 0;
  border: none;
}
</style>