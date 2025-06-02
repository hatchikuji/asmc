<script setup>
import HomeCard from "../components/HomeCard.vue";
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
let user = inject('user');
let playlists = ref([]);
let songs = ref(null);
let songsByPlaylist = ref({});

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

    for (const playlist of playlists.value) {
      songs = await listTitles(playlist.pid);

      songsByPlaylist.value[playlist.pid] = songs;
    }
  } catch (error) {
    console.error('Error loading playlists:', error);
  }
}

async function listTitles(pid) {
  try {
    const res = await fetch(`/api/auth/${encodeURIComponent(user.value.username)}/playlist/${encodeURIComponent(pid)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch playlist titles');
    }

    const data = await res.json();
    return data.playlist.songs;
  } catch (error) {
    console.error('Error loading playlist titles:', error);
  }
}


onMounted(async () => {
  await listPlaylist();
});

</script>

<template>
  <div class="p-8" v-for="(playlist, index) in playlists" :key="index">
    <div v-if="playlist">
      <button type="button" class="text-white text-2xl font-semibold hover:underline cursor-pointer"
              @click="router.push(`/playlist/${playlist.pid}`)">
        {{ playlist.nom }}
      </button>
      <div class="py-1.5"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <HomeCard :image="`https://picsum.photos/id/${playlist.pid}/300/300`"
                  v-for="(song, index) in songsByPlaylist[playlist.pid]" :key="index" :title="song.titre"
                  :subtitle="song.artiste_nom" @click="router.push(`/playlist/${playlist.pid}`)"/>
      </div>
    </div>
  </div>
</template>