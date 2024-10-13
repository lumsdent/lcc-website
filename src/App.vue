<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import StyledRouterLink from './components/StyledRouterLink.vue'
</script>

<template>
  <header class="flex max-h-screen place-items-center leading-6">
    <img alt="LCC logo" class="mr-8" src="@/assets/logo.svg" width="125" height="125" />

    <div class="flex flex-wrap place-items-start">
      <AppHeader msg="Welcome to LCC!" />

      <nav class="-ml-4 mt-4 py-4 text-left text-base">
        <StyledRouterLink title="Home" link="/" />
        <StyledRouterLink title="Match Input" link="/match" />
        <StyledRouterLink title="Registration" link="/registration" />
        <StyledRouterLink title="Teams" link="/teams" />
        <StyledRouterLink title="Players" link="/players" />

        <StyledRouterLink title="Draft" link="/draft" />
        <StyledRouterLink title="Practice" link="/practice" />
        <StyledRouterLink title="Stats" link="/stats" />
        <StyledRouterLink title="Schedule" link="/schedule" />
        <StyledRouterLink title="Contact Us" link="/contact" />
      </nav>
    </div>
  </header>

  <RouterView />
</template>
