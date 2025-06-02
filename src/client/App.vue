<script setup>
import {onMounted, ref, watch} from "vue";
import {getSocket, initSocket} from "./socket/socketApp.js";
import {provide} from 'vue';
import {songStore} from "./store/songs.js";
import {storeToRefs} from "pinia";

import Login from "./views/LoginView.vue";
import MenuItems from "./components/MenuItems.vue";
import SearchView from "./views/SearchView.vue";

import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import MessageBadgeOutline from "vue-material-design-icons/MessageBadgeOutline.vue";
import MessageOutline from "vue-material-design-icons/MessageOutline.vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import RegisterView from "./views/RegisterView.vue";

const useStore = songStore();
const {currentSong, isPlaying} = storeToRefs(useStore);
let openMenu = ref(false);
let openChat = ref(false);
let newChat = ref(false);
const user = ref(null);
let socket = null;
const isAuthenticated = ref(false)
let showRegister = ref(false)
const searchData = ref('')
const playlists = ref(null)
const messages = ref([])
const newMessage = ref('')


async function onLoginSuccess() {
  await createSession();
  await listPlaylist();
}

async function createSession() {
  try {
    const verifyRes = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
    });

    if (!verifyRes.ok) {
      throw new Error('Failed to create session');
    }


    const verifyData = await verifyRes.json();
    user.value = verifyData.user;

    if (!user.value) {
      throw new Error('User not found');
    }

    const userRes = await fetch(`/api/auth/${encodeURIComponent(user.value.username)}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await userRes.json();
    user.value = data.user;

    const tokenRes = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
    })

    const tokenData = await tokenRes.json();

    await initSocket(tokenData.token)
    socket = getSocket()
    isAuthenticated.value = true;
  } catch (err) {
    console.warn('Pas authentifié :', err)
    isAuthenticated.value = false
  }
}

async function deleteSession() {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (socket && socket.connected) {
      socket.disconnect();
    }

    user.value = null;
    isAuthenticated.value = false;
    window.location.reload()
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

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

const sendMessage = () => {
  if (!socket || !socket.connected) {
    console.warn('Socket non connectée')
    return
  }
  if (newMessage.value.trim() === '') return
  const messageData = {
    user: user.value.username,
    content: newMessage.value,
    timestamp: Date.now(),
  }
  socket.emit('sendMessage', messageData)
  newMessage.value = ''
}

const formatHour = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


provide('user', user);
provide('playlists', playlists);
onMounted(async () => {
  isPlaying.value = false;
  await createSession();
  if (user.value) {
    await listPlaylist();
  }
  if(!socket){
    return
  }
  socket.on('newMessage', (messageData) => {
    if (!openChat.value) {
      newChat.value = true
    }
    messages.value.push({
      user: messageData.user,
      content: messageData.content,
      timestamp: messageData.timestamp,
    })
  })
});

watch(openChat, (val) => {
  if (val) {
    newChat.value = false
  }
})
</script>

<template>
  <div v-if="isAuthenticated">
    <div>
      <div
          class="w-[calc(100%-240px)] h-[60px] fixed right-0 z-20 bg-[#101010] bg-opacity-80 flex items-center justify-between">
        <div class="flex items-center ml-6">
          <button type="button" class="rounded-full bg-black p-[1px] cursor-pointer">
            <ChevronLeft fill-color="#FFFFFF" :size="30"/>
          </button>
          <button type="button" class="rounded-full bg-black p-[1px] ml-4 cursor-pointer">
            <ChevronRight fill-color="#FFFFFF" :size="30"/>
          </button>
        </div>
        <div
            class="flex items-center bg-white hover:bg-gray-100 transition rounded-full w-[300px] h-[40px] ml-6 px-4 shadow-sm">
          <img
              class="w-5 h-5 mr-2"
              src="/src/assets/icons/search.png"
          />
          <input
              @input=""
              v-model="searchData"
              type="text"
              placeholder="Rechercher"
              class="flex-grow bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0"
          />
        </div>
        <div class="flex items-center gap-5 align-middle">
          <MessageBadgeOutline v-if="newChat" @click="openChat = !openChat" fill-color="#FFFFFF" :size="25"/>
          <MessageOutline v-else @click="openChat = !openChat" fill-color="#FFFFFF" :size="25"/>
          <span
              v-if="openChat"
              class="fixed w-[300px] h-[400px] bg-[#282828] shadow-2xl rounded-sm top-[52px] right-[35px] p-4 overflow-y-auto flex flex-col justify-between z-50"
          >
            <div class="overflow-y-auto grow mb-3">
              <div v-for="(msg, index) in messages" :key="index" class="mb-3">
                <div class="text-sm text-white font-semibold">
                  {{ msg.user }} {{ formatHour(msg.timestamp) }}
                </div>
                <div class="text-white text-sm">{{ msg.content }}</div>
              </div>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newMessage"
                @keydown.enter="sendMessage"
                class="flex-1 p-2 text-sm rounded bg-[#444] text-white border border-[#555]"
                placeholder="Votre message..."
              />
              <button
                @click="sendMessage"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                Envoyer
              </button>
            </div>
          </span>
          <button
              @click="openMenu = !openMenu" :class="openMenu ? 'bg-[#282828]' : 'bg-black'"
              class="bg-black hover:bg-[#282828] rounded-full p-0.5 mr-8 mt-0.5 cursor-pointer">
            <div class="flex items-center">
              <img
                  class="rounded-full"
                  width="27"
                  :src="`https://picsum.photos/id/${user.id}/300/300`">
              <div class="text-white text-[14px] ml-1.5 font-semibold">{{ user.username }}</div>
              <ChevronDown v-if="!openMenu" fill-color="#FFFFFF" :size="25"/>
              <ChevronUp v-else fill-color="#FFFFFF" :size="25"/>
            </div>
          </button>
          <span
              v-if="openMenu"
              class="fixed w-[190px] bg-[#282828] shadow-2xl rounded-sm top-[52px] right-[35px] p-1 cursor-pointer"
          >
        <ul @click="openMenu = !openMenu" class="text-gray-200 font-semibold text-[14px]">
          <RouterLink to="/profile">
            <li class="px-3 py-2.5 hober:gb-[#3E2D3D] border-b">Profil</li>
          </RouterLink>
          <li class="px-3 py-2.5 hober:gb-[#3E2D3D] border-b" @click="deleteSession">Logout</li>
        </ul>
      </span>
        </div>
      </div>
      <div id="SideNav" class="h-[100%] p-6 w-[240px] fixed z-50 bg-black">
        <RouterLink to="/">
          <img width="125" src="/src/assets/icons/app-logo.png" alt="Logo" class="mb-6"/>
        </RouterLink>
        <div class="my-8"></div>
        <ul>
          <RouterLink to="/">
            <MenuItems class="ml-[1px]" :iconSize="23" name="Accueil" iconString="home" pageUrl="/"/>
          </RouterLink>
          <RouterLink to="/library">
            <MenuItems class="ml-[1px]" :iconSize="23" name="Bibliothèque" iconString="library" pageUrl="/library"/>
          </RouterLink>
          <div class="py-5"/>
          <RouterLink :to="{ name: 'create-playlist'}">
            <MenuItems class="ml-[1px]" :icon-size="30" name="Créer une playlist" iconString="playlist"
                       pageUrl="/create-playlist"/>
          </RouterLink>
          <RouterLink :to="{ name: 'liked'}">
            <MenuItems class="ml-[1px]" :iconSize="30" name="Titres likés" iconString="liked"
                       pageUrl="/liked"/>
          </RouterLink>
        </ul>
        <div class="border-b border-b-gray-700"/>
        <ul v-for="(playlist, index) in playlists" :key="index">
          <RouterLink :to="{ name: 'playlist', params: { pid: playlist.pid }}">
            <li v-if="playlist.nom !== 'Titres Likés'"
                class="font-semibold text-[13px] mt-3 text-gray-300 hover:text-white cursor-pointer select-none">
              {{ playlist.nom }}
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>
    <div class="fixed right-0 top-0 w-[calc(100%-240px)] overflow-auto h-full bg-gradient-to-b from-[#1C1C1C] to-black">
      <div class="mt-[60px]"></div>
      <RouterView v-if="searchData===''"/>
      <SearchView v-else :searchData="searchData"/>
      <div class="mt-[70px]"></div>
    </div>
  </div>
  <div v-else>
    <div v-if="!showRegister" class="fixed w-full h-full">
      <Login @login-success="onLoginSuccess" @register-redirect="showRegister = true"/>
    </div>
    <div v-else class="fixed w-full h-full">
      <RegisterView @login-redirect="showRegister = false"/>
      >
    </div>
  </div>
  <MusicPlayer v-if="isAuthenticated && currentSong"/>
</template>
