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
  <header class="flex max-h-screen place-items-center leading-6">
    <img alt="LCC logo" class="mr-8" src="@/assets/logo.svg" width="125" height="125" />

    <div class="flex flex-wrap place-items-start">
      <AppHeader message="Welcome to LCC!" />
    </div>
  </header>
  <RouterView />
</template>
