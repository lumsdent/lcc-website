<script>
export default {
  name: 'StyledRouterLink',
  props: {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <RouterLink
    class="inline-block border-l px-4 text-logo-blue first-of-type:border-0"
    activeClass="hover:bg-transparent text-text-dark"
    :to="link"
    >{{ title }}</RouterLink
  >
</template>
