<template>
  <div class="flex flex-col flex-wrap lg:flex-row gap-2 w-full justify-center p-2 place-items-center">
    <div v-for="book in books" :key="book.id" class="card bg-base-200 shadow-xl w-84">
      <figure class="">
        <img :src="book.coverUrl" alt="Book cover" class="rounded-t-xl object-cover h-96 w-full" 
          @error="onImageError" /> 
        
      </figure>
      <div class="card-body items-center text-center p-2 h-max">
        <h2 class="card-title">{{ book.title }}</h2>
        <div class="card-actions">
          <button class="btn btn-primary" @click="openBook(book)">Read</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '../db/dexie';
import { useRouter } from 'vue-router';
import { file } from '../renderer/file';
import { liveQuery } from "dexie";
import { useObservable, from } from "@vueuse/rxjs";

const router = useRouter();
const books = useObservable(
  from(liveQuery(async () => {
    const cachedBooks = await db.cache.toArray();
    return await Promise.all(cachedBooks.map(async cache => {
      const book = await db.books.get(cache.bookId);
      return {
        id: cache.bookId,
        title: book?.title || 'Unknown',
        coverUrl: cache.cover ? URL.createObjectURL(cache.cover) : '',
      };
    }));
  }))
);

function onImageError(e: Event) {
  (e.target as HTMLImageElement).src = '/default-cover.png';
}

async function openBook(book: {id: number}) {
  const cache = await db.cache.get(book.id);
  if (cache?.data) {
    file.value = cache.data;
    router.push('/');
  }
}
</script>
