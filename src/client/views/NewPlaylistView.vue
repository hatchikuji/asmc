<script setup>
import MusicNote from "vue-material-design-icons/MusicNote.vue";
import ClockTimeThreeOutline from "vue-material-design-icons/ClockTimeThreeOutline.vue";

import {inject, onMounted, ref} from "vue";
import DotsHorizontal from "vue-material-design-icons/DotsHorizontal.vue";
import Play from "vue-material-design-icons/Play.vue";
import Heart from "vue-material-design-icons/Heart.vue";
import Pause from "vue-material-design-icons/Pause.vue";
import SongRow from "../components/SongRow.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const user = inject('user');
const searchResults = ref([]);
const searchInput = ref('');
const playlistArray = ref([]);

async function onSearchInput() {
  if (searchInput.value.length === 0) {
    searchResults.value = [];
    return;
  }
  try {
    const response = await fetch(`/api/lookup?search=${encodeURIComponent(searchInput.value)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    searchResults.value = data.songs;
    console.log('Search results:', searchResults.value);

  } catch (error) {
    console.error('Error loading search results:', error);
  }
}

function addToPlaylist(song) {
  if (playlistArray.value.some(item => item.id_musique === song.id_musique)) {
    console.log('Song already in playlist');
    return;
  }
  playlistArray.value.push(song);
}

async function createPlaylist() {
  if (playlistArray.value.length === 0 || document.querySelector('input[name="playlistName"]').value === '') {
    console.log('Playlist is empty');
    return;
  }
  try {

    const response = await fetch('/api/auth/user/create-playlist', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.value.username,
        name: document.querySelector('input[name="playlistName"]').value,
        playlist: playlistArray.value
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }

    const data = await response.json();
    console.log('Playlist created:', data);
    router.push({name: 'playlist', params: {id: data.playlistId}});

  } catch (error) {
    console.error('Error creating playlist:', error);
  }
}

</script>

<template>
  <div class="p-8 overflow-hidden">
    <div class="text-white text-2xl font-semibold select-none">
      Nouvelle Playlist
    </div>

    <div class="py-1.5"/>
    <div class="flex items-center  w-full relative h-full">
      <div class="bg-[#252525] p-4 rounded-md m-2">
        <MusicNote :size="130" class="rounded-md"/>
      </div>
      <div class="w-full ml-5">
        <div style="font-size: 33px"
             class="text-white absolute w-full hover:underline cursor-pointer top-0 font-semibold">
          <input type="text" name="playlistName" placeholder="Nouvelle Playlist"
                 class="bg-[#252525] text-white border-none outline-none w-text"/>
        </div>
        <div class="text-gray-300 text-[13px] flex items-center align-middle">
          <div class="flex items-center align-middle gap-2">
            <img :src="`https://picsum.photos/id/${user.id}/300/300`" width="26" class="rounded-full"/>
            <RouterLink :to="{ name: 'profile'}">
              <div class="flex hover:underline cursor-pointer">{{ user.username }}</div>
            </RouterLink>
          </div>
        </div>
        <div class="absolute flex gap-4 items-center justify-start bottom-0 mb-1.5">
            <button type="button" @click="createPlaylist"
                    class="text-sm text-[#005A9C] font-semibold rounded-full px-3 py-1 border border-[#005A9C] transition-all duration-200 cursor-pointer">
              Sauvegarder
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
    <div class="border-b  border-b-[#2A2A2A] mt-2"/>
    <div class="mb-4"/>
    <ul class="w-full" v-if="playlistArray.length" v-for="(song, index) in playlistArray" :key="index">
      <SongRow :id="song.id_musique" :song="song" :artist="song.artiste_nom" :duration="song.duree" :index="++index"/>
    </ul>
    <div class="mt-4 mb-6 px-2">
      <input
          v-model="searchInput"
          @input="onSearchInput"
          type="text"
          placeholder="Rechercher des titres..."
          class="w-full bg-[#1E1E1E] text-white placeholder-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
      />
    </div>
    <div v-if="searchResults.length" class="px-2">
      <ul>
        <li
            v-for="(song, index) in searchResults"
            :key="song.id_musique"
            class="flex justify-between items-center p-3 hover:bg-[#2A2A2A] rounded-md transition-all duration-200"
        >
          <div class="flex items-center gap-4">
            <div class="text-gray-400 text-sm w-6">{{ index + 1 }}</div>
            <div class="flex flex-col">
              <span class="text-white text-sm font-medium">{{ song.titre }}</span>
              <span class="text-gray-400 text-xs">{{ song.artiste_nom }}</span>
            </div>
          </div>
          <button
              @click="addToPlaylist(song)"
              class="text-sm text-[#005A9C] font-semibold rounded-full px-3 py-1 border border-[#005A9C] transition-all duration-200 cursor-pointer"
          >
            + Ajouter
          </button>
        </li>
      </ul>
    </div>
    <div class="mg-4"/>
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