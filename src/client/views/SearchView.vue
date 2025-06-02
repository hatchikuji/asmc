<script setup>
import {onMounted, ref, toRefs, watch} from 'vue';
import HomeCard from "../components/HomeCard.vue";

const props = defineProps({
  searchData: String,
});

const searchResults = ref([]);
const errorMessage = ref(null);

function getDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function randomId() {
  return Math.floor(Math.random() * 70) + 1;
}


async function loadSearch() {
  const res = await fetch(`/api/lookup?search=${encodeURIComponent(props.searchData)}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  if (res.ok) {
    searchResults.value = data.songs;
    errorMessage.value = null;
  } else {
    searchResults.value = [];
    console.error('Erreur lors du chargement: ', data.message);
    errorMessage.value = 'Erreur de connexion au serveur';
  }
}

watch(() => props.searchData, () => {
  loadSearch();
}, {immediate: true});

</script>

<template>
  <div class="p-8">
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    <div v-else-if="searchResults.length === 0" class="text-white text-4xl font-semibold select-none">
      Aucun résultat trouvé.
    </div>
    <div v-else>
      <button type="button" class="text-white text-4xl font-semibold hover:underline cursor-pointer">
        Résultats de la recherche
      </button>
      <div class="py-1.5"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <HomeCard
            v-for="(song, index) in searchResults"
            :key="index"
            :image="'https://picsum.photos/id/' + randomId() + '/300/300'"
            :title=song.titre
            :subtitle=song.artiste_nom
        />
      </div>

    </div>
  </div>
</template>