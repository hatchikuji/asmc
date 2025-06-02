<script setup>
import {ref, toRefs} from "vue";

const props = defineProps({
  image: String,
  title: String,
  subtitle: String,
});

const { image, title, subtitle } = toRefs(props);
</script>

<template>
    <div class="bg-[#111111] p-4 rounded-md m-2 hover:bg-[#252525] cursor-pointer">
      <img class="rounded-md" :src="image" alt="Image" />
      <div class="text-white pt-4 font-semi-bold text-[17px]">{{ title }}</div>
      <div class="text-gray-400 pt-1 pb-3 text-[14px]">{{ subtitle }}</div>
    </div>
</template>
