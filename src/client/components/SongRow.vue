<script setup>
import {inject, onMounted, ref, watch} from "vue";
import Heart from "vue-material-design-icons/Heart.vue";
import HeartOutline from "vue-material-design-icons/HeartOutline.vue";
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import {songStore} from "../store/songs.js";
import {storeToRefs} from "pinia";

const useStore = songStore();
const {currentSong, isPlaying} = storeToRefs(useStore);

const props = defineProps({
  song: Object,
  index: Number,
  playlist: Object,
  isLiked: Boolean,
  likedId: Number,
  refresh: Function,
});

const user = inject('user');
const isHover = ref(false);
const clientIsLiked = ref(props.isLiked)

watch(() => props.isLiked, (newVal) => {
  clientIsLiked.value = newVal;
});

onMounted(() =>{
  loadLiked()
})

function getDuration(duration) {
  const totalSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function updateLiked() {
  const response = await fetch('/api/auth/user/update-playlist', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: user.value.username,
      titreId: props.song.mid,
      isAdded: !props.isLiked,
      playlistId: props.likedId,
    })
  });
  if (!response.ok) {
    throw new Error("Failed to update liked songs");
  }
  clientIsLiked.value = !clientIsLiked.value;

  if (props.refresh) {
    props.refresh();
  }
}

async function loadLiked() {
  const response = await fetch(`/api/auth/${encodeURIComponent(user.value.username)}/liked`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Failed to fetch liked songs");
  }
  const data = await response.json();
  clientIsLiked.value = data.liked.some(s => s.mid === props.song.mid);
}

</script>

<template>
  <li class="flex items-center justify-between rounded-md hover:bg-[#2A2929] select-none"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false">
    <div class="flex items-center w-full py-1.5">
      <div v-if="isHover" class="w-[40px] ml-[14px] mr-[6px] cursor-pointer">
        <Play v-if="!isPlaying" fill-color="#FFFFFF" :size="25" @click="useStore.playPauseThis(song,playlist)"/>
        <Play v-else-if="isPlaying && currentSong?.mid !== song.mid" fill-color="#FFFFFF" :size="25"
              @click="useStore.loadSong(song,playlist)"/>
        <Pause v-else fill-color="#FFFFFF" :size="25" @click="useStore.playPauseSong()"/>
      </div>
      <div v-else class="text-white font-semibold w-[40px] ml-5">
      <span :class="{ 'text-[#005A9C]': currentSong?.mid === song.mid }">
        {{ index }}
      </span>
      </div>
      <div>
        <div
            :class="['font-semibold',currentSong?.mid === song.mid ? 'text-[#005A9C]' : 'text-white']">
          {{ song.titre }}
        </div>
        <div class="text-sm font-semibold text-gray-400">
          {{ song.artiste_nom }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button type="button" v-if="isHover" @click="updateLiked()">
        <Heart v-if="clientIsLiked" fill-color="#005A9C" :size="22"/>
        <HeartOutline v-else fill-color="#FFFFFF" :size="22"/>
      </button>
      <div v-if="song.duree" class="text-xs mx-5 text-gray-400">
        {{ getDuration(song.duree) }}
      </div>
    </div>
  </li>
</template>