<script setup>
import { ref, toRefs, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  iconSize: Number,
  iconString: String,
  pageUrl: String,
  name: String,
});

const { iconSize, iconString, pageUrl, name } = toRefs(props);
let icon = ref(null);
let textIsHover = ref(false);

watchEffect(() => {
  if (route.path === pageUrl.value) {
    icon.value = iconString.value + "-active";
    textIsHover.value = true;
  } else {
    icon.value = iconString.value + "-inactive";
    textIsHover.value = false;
  }
});

const isHover = () => {
  if (icon.value === iconString.value + "-active") return
  if(icon.value === iconString.value + "-inactive") {
    icon.value = iconString.value + "-inactive-hover";
    textIsHover.value = true;
  } else {
    icon.value = iconString.value + "-inactive";
    textIsHover.value = false;
  }
}
</script>

<template>
  <li class="flex items-center justify-start pb-4 cursor-pointer" @mouseenter="isHover()" @mouseleave="isHover()">
    <img :width="iconSize" :src="`/src/assets/icons/${icon}.png`"/>
    <div :class="textIsHover ? 'text-white': 'text-gray-400'"
    class="font-semibold text-[14px] ml-4 mt-0.5">
    <span :class="route.path === pageUrl ? 'text-white': '' ">
      {{ name }}
    </span>
    </div>
  </li>
</template>
