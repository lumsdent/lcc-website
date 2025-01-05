<script>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    RouterView,
    
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex max-h-screen place-items-center leading-6">
      <img alt="LCC logo" class="mr-8" src="@/assets/logo.svg" width="125" height="125" />
      <div class="flex flex-wrap place-items-start">
        <AppHeader message="Welcome to the LCC!" />
      </div>
    </header>
    <main class="flex-grow">
      <RouterView />
    </main>
    <footer class="bg-gray-800 text-white py-4">
      <div class="text-center">(alpha 0.0.0)</div>
    </footer>
  </div>
</template>
