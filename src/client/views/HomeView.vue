<script setup>
import HomeCard from "../components/HomeCard.vue";
import {ref, onMounted} from "vue";

const allSongs = ref([]);

function loadAllSongs() {
  fetch('/api/lookup?search=all', {
    method: 'GET',
    credentials: 'include',
  })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch all songs");
        }
        return response.json();
      })
      .then(data => {
        allSongs.value = data.songs;
      })
      .catch(error => {
        console.error('Error loading all songs:', error);
      });
}
function randomId() {
  return Math.floor(Math.random() * 70) + 1;
}

onMounted(() => {
  loadAllSongs();
});
</script>

<template>
  <div class="p-8">
    <button type="button" class="text-white text-2xl font-semibold hover:underline cursor-pointer">
      Titres disponibles
    </button>
    <div class="py-1.5"/>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <HomeCard
          v-for="(song, index) in allSongs"
          :key="index"
          :image="'https://picsum.photos/id/' + randomId() + '/300/300'"
          :title=song.titre
          :subtitle=song.artiste_nom
      />

    </div>
  </div>
</template>