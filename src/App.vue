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
        <RouterLink
          class="inline-block border-l px-4 first-of-type:border-0"
          activeClass="hover:bg-transparent text-text-dark"
          to="/"
          >Home</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/match"
          >Match Input</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/registration"
          >Registration</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/draft"
          >Draft</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/practice"
          >Practice</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/stats"
          >Stats</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/schedule"
          >Schedule</RouterLink
        >
        <RouterLink
          class="inline-block border-l px-4"
          activeClass="hover:bg-transparent text-text-dark"
          to="/contact"
          >Contact Us</RouterLink
        >
      </nav>
    </div>
  </header>

  <RouterView />
</template>
