<template>
  <ul class="menu bg-base-200 max-w-56 rounded-r-box h-screen hidden md:flex sticky top-0">
    <li>
      <upload-btn />
    </li>
    <li>
      <router-link :class="{'active':$route.fullPath=='/files'}" to="/files">
          <mdi-folder class="w-6 h-6"/>
          <span class="hidden 2xl:block">Files</span>
        </router-link>
    </li>
    <li>
      <router-link :class="{'active':$route.fullPath=='/toc'}"  to="/toc">
          <mdi-format-list-bulleted class="w-6 h-6"/>
          <span class="hidden 2xl:block">TOC</span>
        </router-link>
    </li>
    <li>
      <router-link :class="{'active':$route.fullPath=='/'}"  to="/">
          <mdi:book-open-blank-variant class="w-6 h-6" />
          <span class="hidden 2xl:block">Read</span>
        </router-link>
    </li>
    <li>
      <router-link :class="{'active':$route.fullPath=='/bookmarks'}" to="/bookmarks">
          <mdi-bookmark class="w-6 h-6" />
          <span class="hidden 2xl:block">Bookmarks</span>
        </router-link>
    </li>
    <li>
      <router-link :class="{'active':$route.fullPath=='/settings'}" to="/settings">
          <mdi-cog class="w-6 h-6" />
          <span class="hidden 2xl:block">Settings</span>
        </router-link>
    </li>
  </ul>
  <div class="flex flex-col w-full">
      <router-view v-slot="{Component, route}">
          <component :is="Component" :key="route.path" class="sticky top-0 bg-base-100" :class="{'min-h-screen':outsideHome}"/>
      </router-view>
    <book-vue :class="{'overflow-hidden': outsideHome}" />
  </div>
  <div class="btm-nav [&>button_>_span]:btm-nav-label md:hidden">
    <div @click="chooser?.click">
      <mdi-upload class="w-6 h-6" title="Open an EPUB"/> 
      <span>Upload</span>
    </div>
    <router-link :class="{'active':$route.fullPath=='/files'}" to="/files">
      <mdi-folder />
      <span>Files</span>
    </router-link>
    <router-link :class="{'active':$route.fullPath=='/toc'}"  to="/toc">
      <mdi-format-list-bulleted />
      <span>TOC</span>
    </router-link>
    <router-link :class="{'active':$route.fullPath=='/'}"  to="/">
      <mdi:book-open-blank-variant />
      <span>Read</span>
    </router-link>
    <router-link :class="{'active':$route.fullPath=='/bookmarks'}" to="/bookmarks">
      <mdi-bookmark />
      <span>Bookmarks</span>
    </router-link>
    <router-link :class="{'active':$route.fullPath=='/settings'}" to="/settings">
      <mdi-cog />
      <span>Settings</span>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import BookVue from '../pages/Book.vue';
import UploadBtn from '../library/UploadBtn.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const outsideHome = computed(() => route.fullPath != '/');
</script>
<style>
#app {
  @apply flex flex-col md:flex-row;
}
</style>
<style scoped>

</style>
