<script setup>
import Play from "vue-material-design-icons/Play.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import DotsHorizontal from "vue-material-design-icons/DotsHorizontal.vue";
import Heart from "vue-material-design-icons/Heart.vue";
import ClockTimeThreeOutline from "vue-material-design-icons/ClockTimeThreeOutline.vue";

import SongRow from "../components/SongRow.vue";
import {songStore} from "../store/songs.js";

import {storeToRefs} from "pinia";
import {ref, inject, onMounted} from "vue";

const useStore = songStore();
const likedId = ref(null);
const user = inject('user');
let playlist = ref(null);
const isLoaded = ref(false);
const {isPlaying, currentSong, currentPlaylist} = storeToRefs(useStore)


async function loadLiked() {
  isLoaded.value = false;
  try {
    const response = await fetch(`/api/auth/${encodeURIComponent(user.value.username)}/liked`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch liked songs");
    }

    const data = await response.json();
    playlist.value = data.liked;
    isLoaded.value = true;
  } catch (error) {
    console.error('Error loading liked songs:', error);
  }
}

function play() {
  if (currentSong.value) {
    useStore.playPauseThis(currentSong.value, currentPlaylist.value)
    return
  }
  useStore.playFromFirst(currentPlaylist.value)
}

onMounted(async () => {
  await loadLiked();
});

</script>
<template>
  <div v-if="playlist && isLoaded" class="p-8 overflow-hidden">
    <div class="text-white text-2xl font-semibold">
      Votre playlist préférée
    </div>

    <div class="py-1.5"/>

    <div class="flex items-center w-full relative h-full">
      <div class="bg-[#252525] p-4 rounded-md m-2">
        <Heart :size="130" fill-color="#005A9C" class="rounded-md"/>
      </div>

      <div class="w-full ml-5">
        <div style="font-size: 33px"
             class="text-white absolute w-full top-0 font-semibold">
          Titres likés
        </div>
        <div class="text-gray-300 text-[13px] flex items-center align-middle">
          <div class="flex items-center align-middle gap-2">
            <img :src="`https://picsum.photos/id/${user.id}/300/300`" width="26" class="rounded-full"/>
            <RouterLink :to="{ name: 'profile'}">
              <div class="flex hover:underline cursor-pointer">{{ user.username || '' }}</div>
            </RouterLink>
          </div>
          <div class="ml-2 flex">
            <div class="circle mt-2 mr-2"/>
            <span class="-ml-0.5">{{ playlist.length }} Titres</span>
          </div>
        </div>
        <div class="absolute flex gap-4 items-center justify-start bottom-0 mb-1.5">
          <button type="button" class="p-1 rounded-full bg-white" @click="play()">
            <Play v-if="!isPlaying" fill-color="#181818" :size="25"/>
            <Pause v-else fill-color="#181818" :size="25"/>
          </button>
          <button type="button">
            <Heart fill-color="#005A9C" :size="30"/>
          </button>
          <button type="button">
            <DotsHorizontal fill-color="#FFFFFF" :size="25"/>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-6"/>
    <div class="flex items-center justify-between px-5 pt-2">
      <div class="flex items-center justify-between text-gray-400">
        <div class="mr-7">#</div>
        <div class="text-sm">Titre</div>
      </div>
      <div>
        <ClockTimeThreeOutline fill-color="#FFFFFF" :size="18"/>
      </div>
    </div>
    <div class="border-b border-b-[#2A2A2A] mt-2"/>
    <div class="mg-4"/>
    <ul class="w-full" v-if="playlist.songs.length" v-for="(song, index) in playlist.songs" :key="index">
      <SongRow :song="song" :index="++index" :isLiked="true" :likedId="playlist.pid" :playlist="playlist"
               :refresh="loadLiked"/>
    </ul>
  </div>
</template>
<style scoped>
.circle {
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: #ffffff;
}
</style>