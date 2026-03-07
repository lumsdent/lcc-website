<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :alt="altText"
    :class="rounded"
    v-bind="$attrs"
  />
</template>

<script>
import teamsDataJson from '@/data/teamsData.json'

/**
 * Reusable team logo image.
 *
 * Usage (by team name – picks the most recent logo):
 *   <TeamLogo :teamName="'Piltover Progress'" class="w-12 h-12" />
 *
 * Usage with date-aware logo (picks the logo active at that date):
 *   <TeamLogo :teamName="'Bandle City Buckaroos'" :gameDate="match.info.gameCreation" class="w-14 h-14" />
 *
 * Usage with rounded corners:
 *   <TeamLogo :teamName="'Targon Titans'" rounded="rounded-xl" class="w-14 h-14 object-contain" />
 *
 * Usage with explicit file name (gallery / bio card):
 *   <TeamLogo :imageName="'PRO_4.svg'" class="w-32 h-32 object-contain" />
 */
export default {
  name: 'TeamLogo',
  // Allow consumers to pass class/style directly to the <img>
  inheritAttrs: false,
  props: {
    /** Look up the team by name and resolve the appropriate logo. */
    teamName: { type: String, default: null },
    /** Use an explicit image file name from assets/teams/. */
    imageName: { type: String, default: null },
    /**
     * A date (timestamp number, ISO string, or Date) used to pick the logo
     * that was active at the time of a match. Falls back to the most recent
     * logo when not provided or when no date range matches.
     */
    gameDate: { type: [Number, String, Date], default: null },
    /**
     * Tailwind rounded class applied to the <img>. Pass e.g. "rounded-xl"
     * or "rounded-full". Defaults to no rounding.
     */
    rounded: { type: String, default: '' },
  },
  computed: {
    altText() {
      return this.teamName || this.imageName || 'Team logo'
    },
    resolvedImageName() {
      if (this.imageName) return this.imageName

      if (this.teamName) {
        const found = teamsDataJson.teams.find(
          t => t.name === this.teamName || t.formerName === this.teamName
        )
        if (!found) return null

        // Try to find the logo that was active on the given match date
        if (this.gameDate && found.images?.length) {
          const matchDate = new Date(this.gameDate)
          const dated = found.images.find(img => {
            const parts = img.date?.split(' - ') ?? []
            if (parts.length !== 2) return false
            const from = new Date(parts[0])
            const to = parts[1].trim().toLowerCase() === 'present' ? new Date() : new Date(parts[1])
            return matchDate >= from && matchDate <= to
          })
          if (dated) return dated.name
        }

        // Fall back to the most recent logo (first in array)
        if (found.images?.length) return found.images[0].name
        if (found.image) return found.image
      }

      return null
    },
    resolvedSrc() {
      if (!this.resolvedImageName) return null
      try {
        return new URL(`../assets/teams/${this.resolvedImageName}`, import.meta.url).href
      } catch {
        return null
      }
    },
  },
}
</script>
