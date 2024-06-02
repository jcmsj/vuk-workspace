<template>
    <router-link :class="routerClass" :to="to">
    <slot name="icon">

    </slot>
    <span :class="spanClass">
        <slot></slot>
    </span>
    </router-link>
  </template>
  
  <script setup lang="ts">
import { HTMLAttributes, computed } from 'vue';
  import { useRoute } from 'vue-router';
  const props = defineProps<{
    to: string
    routerClass?: HTMLAttributes['class']
    spanClass?: HTMLAttributes['class']
  }>();
  const $route = useRoute();
  const isActive = computed(() => $route.fullPath == props.to);
  const routerClass = computed(() => ({
    active: isActive.value,
    ...props.routerClass
  }));
  </script>
