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
        version: 'Beta v1.5.0 - Season 4 Wrap-Up & Season 5 Kickoff',
        date: '2026-07-02',
        description: 'Season 4 is officially in the books! This update celebrates the Season 4 champions, opens registration for Season 5, and includes a handful of improvements across the site.',
        sections: [
          {
            title: 'Season 4 Champions',
            features: [
              { title: 'Champions Banner', description: 'The Season 4 Champions Banner now hangs in the header alongside the banners of previous seasons.' },
              { title: 'Season 4 Highlight Reel', description: 'The home page now features the Season 4 highlight video.' },
              { title: 'Art Gallery', description: 'New community art pieces have been added to the gallery, including the LCC Trophy and player artwork.' }
            ]
          },
          {
            title: 'Season 5',
            features: [
              { title: 'Season 5 Is Here', description: 'The site header now reflects Season 5. Season 5 Regular Season, Tiebreakers, and Playoffs are available in all season filters across the site.' },
              { title: 'Registration Open', description: 'Registration for Season 5 is now open. Sign up before it closes!' },
              { title: 'Updated Commitment Text', description: 'The registration commitment wording has been updated to be clearer about expectations for attending matches.' }
            ]
          },
          {
            title: 'General Improvements',
            features: [
              { description: 'Updated to the latest patch data (16.13.1) for champion and item assets.' }
            ]
          }
        ],
        comingSoon: [
          'Season 5 stats and standings',
          'Let me know what else you\'d like to see!'
        ]
      },
      {
        version: 'Beta v1.4.0 - Art Gallery, Stats Fixes & Profile Improvements',
        date: '2026-03-10',
        description: 'An update focused on exploring stats in more depth, fixing some bugs, and improving community engagement with a new Art Gallery page.',
        sections: [
          {
            title: 'CHARTS, CHARTS, CHARTS!',
            description: 'A Stats overview screen with graphics of our top performers',
            features: [
              { title: 'Team Colors', description: 'All charts are color-coded by team for easy identification.' }
              
            ]
          },
          {
            title: 'Player Statistics',
            description: 'The Player Statistics page tracks aggregated performance data for every player across all LCC matches.',
            features: [
              { title: 'Season Filter', description: 'Switch between individual seasons or view all-time aggregates with a single click.' },
              { title: 'Sortable Columns', description: 'Click any column header to sort — including Player Name (fixed this update), KDA, Damage/min, CS/min, Gold/min, and more.' },
              { title: 'Customisable Columns', description: 'Choose exactly which stats you want on screen. Preferences are saved in your browser so they persist between visits.' },
            ]
          },
          {
            title: 'Champion Stats',
            description: 'Each player profile includes a full champion stats breakdown showing how they\'ve performed on every champion they\'ve played in the league.',
            features: [
              { title: 'Per-Champion Rows', description: 'Each champion is its own row showing games played, win rate, KDA, K/D/A, kill participation, damage/min, and CS@14.' },
              { title: 'Sortable', description: 'Click any column to sort by that stat — useful for finding a player\'s most-played or best-performing champion.' },
              { title: 'Filter Match History', description: 'Click a champion row to filter the match history table on that page to only show games on that champion.' }
            ]
          },
                   {
            title: 'Art Gallery',
            description: 'A new Art Gallery page is now live.',
            features: [
              { title: 'Community Art', description: 'Browse fan and community art submitted for the league, all in one place.' },
            ]
          },
          {
            title: 'Bug Fixes',
            features: [
              { description: 'Fixed images.' },
              { description: 'Fixed seasons missing from the season filter on the Player/Team page.' }
            ]
          }
        ],
        comingSoon: [
          'Idk, Let me know what you want to see next!'
        ]
      },
      {
        version: 'Beta v1.3.0 - Teams, Players, Matches & Profile Overhaul',
        date: '2026-03-05',
        description: 'A major update across the Teams, Players, and Matches pages — adding search and filtering throughout, improving how match details are presented, closing Season 4 registration, and keeping player profiles up to date.',
        sections: [
          {
            title: 'Teams Page',
            description: 'The Teams page has been completely redesigned.',
            features: [
              { title: 'All Teams Always Visible', description: 'All teams are now listed at all times — the full franchise history is always on display.' },
              { title: 'Season Filter', description: 'Filter by season to see only the teams that competed that year.' },
              { title: 'Team Cards', description: 'Each team shows their logo, name, any former name, founding year, and which seasons they played in.' },
              { title: 'Click to Explore', description: 'Click any team card to go to that team\'s dedicated page.' }
            ]
          },
          {
            title: 'Team Pages — New',
            description: 'Each team now has their own dedicated page.',
            features: [
              { title: 'Season Histories', description: 'Read the full story of how each team performed across every season they competed in.' },
              { title: 'Win/Loss Record', description: 'See a visual breakdown of wins and losses for each season.' },
              { title: 'Roster', description: 'Browse the team\'s roster for any season, organised by role.' },
              { title: 'Awards', description: 'See how many MVPs and All-Pro honours the organisation has earned.' },
              { title: 'Recent Matches', description: 'A quick look at the team\'s most recent results.' }
            ]
          },
          {
            title: 'Players Page',
            features: [
              { title: 'Active Players by Default', description: 'Only active players are shown by default. Toggle the filter to also see inactive or past players.' },
              { title: 'Search by Name', description: 'Type a name to instantly find any player.' },
              { title: 'Filter by Role', description: 'Filter players by their role — TOP, JUNGLE, MID, ADC, SUPPORT, or FLEX.' }
            ]
          },
          {
            title: 'Player Profiles',
            features: [
              { title: 'Keep Info Fresh', description: 'A new button on each player\'s profile lets you pull their latest info from Riot — useful after a name change.' }
            ]
          },
          {
            title: 'Matches Page',
            description: 'The Matches page now has a full set of filters to help you find exactly the game you\'re looking for.',
            features: [
              { title: 'Season Filter', description: 'Jump straight to matches from a specific season.' },
              { title: 'Team Filter', description: 'Filter matches by team to see only games involving that team.' },
              { title: 'Date Range', description: 'Narrow results down to a specific time window.' },
              { title: 'Duration Filter', description: 'Looking for a short stomp or a long-running classic? Filter by how long games lasted.' },
              { title: 'Match Count', description: 'Always see how many matches your current filters are showing.' }
            ]
          },
          {
            title: 'Match Detail Page',
            features: [
              { title: 'VODs are Here', description: 'Admins can now upload VODs for each match, making it easy to watch the game directly from the match page.' },
            ]
          },
          {
            title: 'Registration',
            features: [
              { title: 'Season 4 Registration Closed', description: 'Registration for Season 4 closed on February 5, 2026. It will reopen ahead of the next season.' }
            ]
          },
          {
            title: 'General Improvements',
            features: [
              { description: 'Cards across the site have a consistent look and feel, with a subtle lift effect when you hover over them.' },
              { description: 'On smaller screens, team names are shown as short codes to save space.' }
            ]
          }
        ],
        comingSoon: [
          'Stats, Stats, Stats!'
        ]
      },
      {
        version: 'Beta v1.2.0 - Statistics & Match History Update',
        date: '2025-04-30',
        description: "A major update introducing two powerful new features: the Player Statistics page and the Match History overview. These tools give you access to performance data for all players in Season 3.",
        sections: [
          {
            title: 'Player Statistics Page',
            description: 'Browse season statistics for all players in the league.',
            features: [
              { 
                title: 'Comprehensive Stats', 
                description: 'View KDA, damage dealt, kill participation, CS, gold earned, vision score, wards, win rates, and more — all in one place.' 
              },
              { 
                title: 'Team Colours', 
                description: 'Each player\'s team is colour-coded for easy identification.' 
              },
              { 
                title: 'Pick Your Columns', 
                description: 'Choose which stats you want to see. Your preferences are saved so they\'re there next time you visit.' 
              },
              { 
                title: 'Sort by Anything', 
                description: 'Click any column to sort the table by that stat.' 
              },
              { 
                title: 'Click for Full Profile', 
                description: 'Click any player to go straight to their profile page.' 
              }
            ]
          },
          {
            title: 'Match History Page',
            description: 'Browse through past matches with cards showing team logos and results.',
            features: [
              { 
                title: 'Match Cards', 
                description: 'Each match shows team logos, the result, game duration, patch, and kill totals.' 
              },
              { 
                title: 'Most Recent First', 
                description: 'Matches are sorted with the newest games at the top.' 
              },
              { 
                title: 'Click for Full Breakdown', 
                description: 'Click any match to see the full scoreboard.' 
              }
            ]
          },
          {
            title: 'Bug Fixes',
            features: [
              { description: 'Sharing a direct link to a page now takes you to the right place.' },
              { description: 'The navigation refresh button has been restored.' }
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
            title: 'Features',
            features: [
              { description: 'Team registration' },
              { description: 'Match scheduling' },
              { description: 'Player profiles' },
              { description: 'Match history' }
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