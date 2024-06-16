<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <header class="flex max-h-screen place-items-center leading-6">
    <img alt="LCC logo" class="mr-8" src="@/assets/logo.svg" width="125" height="125" />

    <div class="flex flex-wrap place-items-start">
      <AppHeader msg="Welcome to LCC!" />

      <nav class="-ml-4 mt-4 py-4 text-left text-base">
        <RouterLink class="inline-block border-l px-4 first-of-type:border-0" to="/">Home</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/match">Match Input</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/registration">Registration</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/draft">Draft</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/practice">Practice</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/stats">Stats</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/schedule">Schedule</RouterLink>
        <RouterLink class="inline-block border-l px-4" to="/contact">Contact Us</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>


nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

/* nav a:first-of-type {
  border: 0;
} */
</style>
