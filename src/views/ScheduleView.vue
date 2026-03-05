<script></script>

<template>
  <div class="p-6 max-w-7xl mx-auto">

    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Schedule</h1>
      <p class="text-gray-400">LCC Tournament Calendar</p>
    </div>

    <div class="rounded-xl overflow-hidden border border-gray-700" style="filter: invert(1) hue-rotate(180deg);">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=7a75378993bd0c8a7f221b76c428f4c57895967eba795e75101057e19360b4ce%40group.calendar.google.com&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0"
        style="border: 0; display: block;"
        width="100%"
        height="700"
        frameborder="0"
        scrolling="no"
      ></iframe>
    </div>

  </div>
</template>

<style scoped>
/* Prevent the invert filter from affecting the page background behind the iframe */
div[style*="invert"] {
  background-color: #fff;
}
</style>
