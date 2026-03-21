<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">

    <!-- Header -->
    <div class="pb-4 text-center">
      <h1 class="text-3xl font-bold text-white mb-1">Art Gallery</h1>
      <p class="text-gray-400 text-sm">{{ images.length }} piece{{ images.length !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Empty state -->
    <div v-if="images.length === 0" class="flex flex-col items-center justify-center py-24 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-lg font-medium">No art yet</p>
      <p class="text-sm mt-1">Add images to <code class="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">src/assets/art/</code> to display them here.</p>
    </div>

    <!-- Masonry collage -->
    <div v-else class="masonry pb-6">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="masonry-item"
        @click="openLightbox(i)"
      >
        <img
          :src="img.src"
          :alt="img.name"
          class="w-full block rounded-lg"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxIndex !== null"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <!-- Close -->
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          @click="closeLightbox"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Prev -->
        <button
          v-if="images.length > 1"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
          @click="stepLightbox(-1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Image -->
        <img
          :src="images[lightboxIndex].src"
          :alt="images[lightboxIndex].name"
          class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          @click.stop
        />

        <!-- Next -->
        <button
          v-if="images.length > 1"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
          @click="stepLightbox(1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Caption -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
          {{ images[lightboxIndex].name }} &mdash; {{ lightboxIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

// Eagerly import everything in src/assets/art/ at build time via Vite glob.
// Supported extensions: jpg, jpeg, png, gif, webp, svg, avif.
const artModules = import.meta.glob(
  '@/assets/art/*.{jpg,jpeg,png,gif,webp,svg,avif}',
  { eager: true }
)

function buildImageList() {
  const list = Object.entries(artModules).map(([path, mod]) => ({
    src:  mod.default,
    name: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  }))
  // Fisher-Yates shuffle for a different order every load
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export default {
  name: 'ArtGalleryView',
  setup() {
    const images       = buildImageList()
    const lightboxIndex = ref(null)

    const openLightbox  = (i) => { lightboxIndex.value = i }
    const closeLightbox = ()  => { lightboxIndex.value = null }
    const stepLightbox  = (dir) => {
      lightboxIndex.value = (lightboxIndex.value + dir + images.length) % images.length
    }

    const onKeydown = (e) => {
      if (lightboxIndex.value === null) return
      if (e.key === 'Escape')      closeLightbox()
      if (e.key === 'ArrowRight')  stepLightbox(1)
      if (e.key === 'ArrowLeft')   stepLightbox(-1)
    }
    onMounted(()   => window.addEventListener('keydown', onKeydown))
    onUnmounted(() => window.removeEventListener('keydown', onKeydown))

    return { images, lightboxIndex, openLightbox, closeLightbox, stepLightbox }
  }
}
</script>

<style scoped>
.gallery-page {
  min-height: 100vh;
}

.masonry {
  columns: 2;
  column-gap: 0.75rem;
}

@media (min-width: 640px) { .masonry { columns: 3; } }

.masonry-item {
  break-inside: avoid;
  margin-bottom: 0.75rem;
  cursor: zoom-in;
  overflow: hidden;
  border-radius: 0.5rem;
}

.masonry-item img {
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.9;
}

.masonry-item:hover img {
  transform: scale(1.03);
  opacity: 1;
}
</style>
