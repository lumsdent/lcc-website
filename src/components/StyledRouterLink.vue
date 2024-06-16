<script setup lang="ts">
defineProps<{
  title: string
  link: string
}>()
</script>

<template>
  <RouterLink
    class="inline-block border-l px-4 text-logo-blue first-of-type:border-0"
    activeClass="hover:bg-transparent text-text-dark"
    :to="link"
    >{{ title }}</RouterLink
  >
</template>
