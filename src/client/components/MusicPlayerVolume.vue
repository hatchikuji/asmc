<script setup>
import {ref, onMounted, watch} from "vue";

import VolumeMute from "vue-material-design-icons/VolumeMute.vue";
import VolumeHigh from "vue-material-design-icons/VolumeHigh.vue";

import {songStore} from "../store/songs.js";
import {storeToRefs} from "pinia";

const useStore = songStore();
const {audio} = storeToRefs(useStore);
let volumeDefault = ref(60);
let volume = ref(null)
let isHover = ref(false);

onMounted(() =>{
  volume.value.addEventListener('input', (event) => {
    audio.value.volume = event.currentTarget.value / 100;
  })
})

watch(audio, (newAudio) => {
  if (newAudio instanceof Audio) {
    newAudio.volume = volumeDefault.value / 100;
  }
});
</script>

<template>
  <VolumeMute v-if="audio && audio.volume === 0" fill-color="#FFFFFF" :size="20"/>
  <VolumeHigh v-else fill-color="#FFFFFF" :size="20"/>
  <div class="flex items-center ml-2 w-[150px] relative mt-2 mb-[23px]"
       @mouseenter="isHover = true"
       @mouseleave="isHover = false">
    <input type="range" v-model="volumeDefault" ref="volume"
           class="absolute rounded-full my-2 w-full h-0 z-40 mt-[24px] appearance-none bg-oppacity-100 focus:outline-none accent-white"
           :class="{'rangeDotHidden': !isHover}"/>
    <div class="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0" :style="`width:${volumeDefault}%;`"
         :class="isHover ? 'bg-[#005A9C]' : 'bg-white'"/>
    <div class="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full"/>
  </div>
</template>
