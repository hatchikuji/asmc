<script setup>
import {inject, onMounted, ref} from 'vue'
import HomeCard from "../components/HomeCard.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const user = inject('user')
const playlists = ref(null)

async function listPlaylist() {
  try {
    const res = await fetch(`/api/auth/${encodeURIComponent(user.value.username)}/playlists`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await res.json();
    playlists.value = data.playlists;
  } catch (error) {
    console.error('Error loading playlists:', error);
  }
}

onMounted(() =>{
  listPlaylist()
})

</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#005A9C] to-gray-900 text-white">
    <div class="flex items-end space-x-6 p-8">
      <img
          :src="`https://picsum.photos/id/${user.id}/300/300`"
          class="w-32 h-32 rounded-full object-cover shadow-lg"
      />
      <div>
        <p class="uppercase text-sm font-semibold text-white/70">Profil</p>
        <h1 class="text-4xl md:text-6xl font-bold">{{ user.username }}</h1>
        <p class="mt-2 text-white/70">{{user.nb_playlist }} playlist</p>
      </div>
    </div>

    <div class="p-8">
      <h2 class="text-2xl font-semibold mb-4">Playlists récentes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <HomeCard
            v-if="playlists"
            v-for="(playlist, index) in playlists"
            :key="index"
            :image="'https://picsum.photos/id/' + playlist.pid + '/300/300'"
            :title=playlist.nom
            @click="router.push(`/playlist/${playlist.pid}`)"
        />
    </div>
  </div>
  </div>
</template>
