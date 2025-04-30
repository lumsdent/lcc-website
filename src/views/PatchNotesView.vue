<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-logo-blue mb-6">Patch Notes</h1>

    <!-- Patch Notes List -->
    <div class="space-y-8">
      <div v-for="(patch, index) in patchNotes" :key="index" 
           class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        
        <!-- Patch Header -->
        <div class="bg-gray-700 px-4 py-3 flex justify-between items-center">
          <h2 class="text-xl font-bold">{{ patch.version }}</h2>
          <span class="text-sm text-gray-300">{{ formatDate(patch.date) }}</span>
        </div>
        
        <!-- Patch Content -->
        <div class="p-4">
          <p class="text-gray-300 mb-4">{{ patch.description }}</p>
          
          <!-- Feature Sections -->
          <div v-for="(section, sectionIndex) in patch.sections" :key="sectionIndex" class="mb-6">
            <h3 class="text-lg font-semibold mb-2 text-logo-blue">{{ section.title }}</h3>
            <p v-if="section.description" class="mb-3 text-gray-300">{{ section.description }}</p>
            
            <!-- Feature List -->
            <ul class="list-disc pl-5 space-y-2">
              <li v-for="(feature, featureIndex) in section.features" :key="featureIndex" class="text-gray-300">
                <span v-if="feature.title" class="font-medium">{{ feature.title }}:</span> {{ feature.description }}
              </li>
            </ul>
          </div>
          
          <!-- Coming Soon Section -->
          <div v-if="patch.comingSoon && patch.comingSoon.length" class="mt-6">
            <h3 class="text-lg font-semibold mb-2 text-logo-blue">Coming Soon</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(item, itemIndex) in patch.comingSoon" :key="itemIndex" class="text-gray-300">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PatchNotesView',
  setup() {
    const patchNotes = ref([
      {
        version: 'Beta v1.2.0 - Statistics & Match History Update',
        date: '2025-04-30',
        description: "We're excited to release a major update to the LCC website that introduces two powerful new features: the Player Statistics page and the Match History overview.These tools give you unprecedented access to performance data for all players in Season 3.",
        sections: [
          {
            title: 'Player Statistics Page',
            description: 'Browse season statistics for all players in the league.',
            features: [
              { 
                title: 'Comprehensive Player Data', 
                description: 'Available statistics include combat metrics (KDA, damage, kill participation), economy stats (CS, gold, CS/min), objectives (vision score, wards placed/cleared), and game performance (win rates, games played).' 
              },
              { 
                title: 'Team Identification', 
                description: 'Teams are color-coded for easy visual identification with official team colors.' 
              },
              { 
                title: 'Customizable Display', 
                description: 'Choose which stats matter most to you with our column selector. Your column preferences are even saved between sessions.' 
              },
              { 
                title: 'Advanced Sorting', 
                description: 'Sort by any available statistic by using the sorting dropdown menu.' 
              },
              { 
                title: 'Performance Indicators', 
                description: 'Color-coded KDA values and visual progress bars for win rates help you quickly assess player performance.' 
              },
              { 
                title: 'Player Profiles', 
                description: 'Click on any player row to navigate to their detailed profile page.' 
              }
            ]
          },
          {
            title: 'Match Overview Page',
            description: 'Browse through past matches with visual cards showing teams and results.',
            features: [
              { 
                title: 'Visual Match Cards', 
                description: 'Each match is displayed as a card with team logos, match result, and key statistics.' 
              },
              { 
                title: 'Chronological Order', 
                description: 'Matches are sorted with the most recent games at the top.' 
              },
              { 
                title: 'Team Visualization', 
                description: 'Clear blue/red team distinction with team logos and colors.' 
              },
              { 
                title: 'Key Match Info', 
                description: 'See game duration, patch version, and kill scores at a glance.' 
              },
              { 
                title: 'Detail Navigation', 
                description: 'Click any match card to see the full match breakdown.' 
              }
            ]
          },
          {
            title: 'Technical Improvements',
            features: [
              { description: 'Direct linking to specific pages is now working correctly.  The refresh button is back on the menu' },
              { description: 'Fast loading times with visual loading indicators.' }
            ]
          }
        ],
        comingSoon: [
          'Player Individual Champion Statistics',
          'Team History Page',
        ]
      },
      {
        version: 'Beta v1.1.0 - Initial Release',
        date: '2025-04-15',
        description: 'First public release of the LCC website.',
        sections: [
          {
            title: 'Core Features',
            features: [
              { description: 'Team registration system' },
              { description: 'Match scheduling' },
              { description: 'Basic player profiles' },
              { description: 'Match History' }
            ]
          }
        ],
        comingSoon: []
      }
    ])

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    return {
      patchNotes,
      formatDate
    }
  }
}
</script>