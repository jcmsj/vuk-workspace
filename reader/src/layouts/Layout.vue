<template>
  <ul class="menu bg-base-200 max-w-56 rounded-r-box h-screen hidden md:flex sticky top-0">
    <li>
      <upload-btn upload-span-class="sidebar-label" />
    </li>
    <li>
      <nav-link to="/files" spanClass="sidebar-label">
        <template #icon>
          <mdi-folder class="sidebar-icon" />
        </template>
        Files
      </nav-link>
    </li>
    <li>
      <nav-link to="/toc" spanClass="sidebar-label">
        <template #icon>
          <mdi-format-list-bulleted class="sidebar-icon" />
        </template>
        TOC
      </nav-link>
    </li>
    <li>
      <nav-link to="/" spanClass="sidebar-label">
        <template #icon>
          <mdi:book-open-blank-variant class="sidebar-icon" />
        </template>
        Read
      </nav-link>
    </li>
    <li>
      <nav-link to="/bookmarks" spanClass="sidebar-label">
        <template #icon>
          <mdi-bookmark class="sidebar-icon" />
        </template>
        Bookmarks
      </nav-link>
    </li>
    <li>
      <nav-link to="/settings" spanClass="sidebar-label">
        <template #icon>
          <mdi-cog class="sidebar-icon" />
        </template>
        Settings
      </nav-link>
    </li>
  </ul>
  <div class="flex flex-col w-full">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" class="sticky top-0 bg-base-100"
        :class="{ 'min-h-screen': outsideHome }" />
    </router-view>
    <book-vue :class="{ 'overflow-hidden': outsideHome }" @click.right.prevent="showContextMenu($event)" />
    <ReaderContextMenu v-model:location="desiredLocation" @select="onSelect" />
  </div>
  <div class="btm-nav md:hidden">
    <upload-btn />
    <nav-link to="/files">
      <template #icon>
        <mdi-folder class="botbarIcon" />
      </template>
      Files
    </nav-link>
    <nav-link to="/toc">
      <template #icon>
        <mdi-format-list-bulleted class="botbarIcon" />
      </template>
      TOC
    </nav-link>
    <nav-link to="/">
      <template #icon>
        <mdi:book-open-blank-variant class="botbarIcon" />
      </template>
      Read
    </nav-link>
    <nav-link to="/bookmarks">
      <template #icon>
        <mdi-bookmark class="botbarIcon" />
      </template>
      Bookmarks
    </nav-link>
    <nav-link to="/settings">
      <template #icon>
        <mdi-cog class="botbarIcon" />
      </template>
      Settings
    </nav-link>
  </div>
</template>
<script setup lang="ts">
import BookVue from '../pages/Book.vue';
import UploadBtn from '../library/UploadBtn.vue';
import NavLink from '../components/NavLink.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useContextMenu } from '../composables/useContextMenu';
import ReaderContextMenu from '../contextMenu/ReaderContextMenu.vue';
import {onClick as onBookmarkClick} from "../bookmarks"
const { desiredLocation, show: showContextMenu, mouseEvent } = useContextMenu()
const route = useRoute()
const outsideHome = computed(() => route.name != 'root');

function onSelect(option: 'read-aloud' | 'bookmark' | 'copy') {
  if (option == 'bookmark') {
    console.log('Bookmarking')
    if  (mouseEvent.value) {
      onBookmarkClick(mouseEvent.value)
    } else {
      throw Error('No mouse event')
    }
  } else if (option == 'read-aloud') {
    console.log('Reading aloud')
  } else {
    console.log('Copying')
  }
}
</script>
<style>
#app {
  @apply flex flex-col md:flex-row;
}
</style>
<style scoped>
.sidebar-icon {
  @apply w-6 h-6;
}

:deep(.sidebar-label) {
  @apply hidden xl:block;
}

.botbarIcon {
  @apply w-6 h-6;
}
</style>
