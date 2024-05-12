<template>
  <main>
    <h1 class="blue">Practice</h1>
    <form v-if="!preMatchFormSubmitted" @submit.prevent="submitForm">
      <p>Fill this part of the form out prior to your match</p>
      <label class="blue" for="summonerName">Summoner Name:</label><br />
      <input
        type="text"
        id="summonerName"
        name="summonerName"
        v-model="preMatch.summonerName"
      /><br />
      <label class="blue" for="tag">Tag:</label><br />
      <input type="text" id="tag" name="tag" v-model="preMatch.tag" /><br />

      <p class="blue">Queue Type:</p>
      <input type="radio" id="solo" name="queueType" value="solo" v-model="preMatch.gameMode" />
      <label for="solo">Solo Ranked</label><br />
      <input type="radio" id="duo" name="queueType" value="duo" v-model="preMatch.gameMode" />
      <label for="duo">Duo Ranked</label><br />
      <input type="radio" id="flex" name="queueType" value="flex" v-model="preMatch.gameMode" />
      <label for="flex">Flex Ranked</label><br />
      <input type="radio" id="normal" name="queueType" value="normal" v-model="preMatch.gameMode" />
      <label for="normal">Normal Draft</label><br />

      <p class="blue">Lane:</p>
      <input type="radio" id="top" name="primaryRole" value="top" v-model="preMatch.lane" />
      <label for="top">Top</label><br />
      <input type="radio" id="jungle" name="primaryRole" value="jungle" v-model="preMatch.lane" />
      <label for="jungle">Jungle</label><br />
      <input type="radio" id="mid" name="primaryRole" value="mid" v-model="preMatch.lane" />
      <label for="mid">Mid</label><br />
      <input type="radio" id="adc" name="primaryRole" value="adc" v-model="preMatch.lane" />
      <label for="adc">ADC</label><br />
      <input type="radio" id="support" name="primaryRole" value="support" v-model="preMatch.lane" />
      <label for="support">Support</label><br />
      <p class="blue">Your champion:</p>
      <select v-model="preMatch.myChampion">
        <option v-for="champion in champions" :key="champion.id" :value="champion.id">
          {{ champion.name }}
        </option></select
      ><br />
      <p class="blue">Lane Matchup:</p>
      <select v-model="preMatch.opponentChampion">
        <option v-for="champion in champions" :key="champion.id" :value="champion.id">
          {{ champion.name }}
        </option></select
      ><br />

      <label class="blue" for="goal">What is your practice goal for this match?</label><br />
      <textarea id="goal" v-model="preMatch.goal" name="goal"></textarea><br />

      <input type="submit" value="Submit" />
    </form>
    <form v-else @submit.prevent="handleSubmit">
      <p>Complete this form following your match</p>
      <label class="blue" for="result">Match Result</label><br />
      <input type="radio" id="win" name="result" value="win" v-model="postMatch.result" />
      <label for="win">Win</label><br />
      <input type="radio" id="loss" name="result" value="loss" v-model="postMatch.result" />
      <label for="loss">Loss</label><br />
      <label class="blue" for="lesson">What did you learn?</label><br />
      <textarea id="lesson" v-model="postMatch.lesson" name="lesson"></textarea><br />

      <label class="blue" for="focus">Focus Rating</label><br />
      <label for="focus1">1</label>
      <input type="radio" id="focus1" name="focus1" value="1" v-model="postMatch.focus" />
      <label for="focus2">2</label>
      <input type="radio" id="focus2" name="focus2" value="2" v-model="postMatch.focus" />
      <label for="focus3">3</label>
      <input type="radio" id="focus3" name="focus3" value="3" v-model="postMatch.focus" />
      <label for="focus4">4</label>
      <input type="radio" id="focus4" name="focus4" value="4" v-model="postMatch.focus" />
      <label for="focus5">5</label>
      <input type="radio" id="focus5" name="focus5" value="5" v-model="postMatch.focus" />
      <br />
      <label class="blue" for="performance">Performance Rating</label><br />
      <label for="performance1">1</label>
      <input
        type="radio"
        id="performance1"
        name="performance1"
        value="1"
        v-model="postMatch.performance"
      />
      <label for="performance2">2</label>
      <input
        type="radio"
        id="performance2"
        name="performance2"
        value="2"
        v-model="postMatch.performance"
      />
      <label for="performance3">3</label>
      <input
        type="radio"
        id="performance3"
        name="performance3"
        value="3"
        v-model="postMatch.performance"
      />
      <label for="performance4">4</label>
      <input
        type="radio"
        id="performance4"
        name="performance4"
        value="4"
        v-model="postMatch.performance"
      />
      <label for="performance5">5</label>
      <input
        type="radio"
        id="performance5"
        name="performance5"
        value="5"
        v-model="postMatch.performance"
      />
      <br />
      <label class="blue" for="mental">Mental Rating</label><br />
      <label for="mental1">1</label>
      <input type="radio" id="mental1" name="mental1" value="1" v-model="postMatch.mental" />
      <label for="mental2">2</label>
      <input type="radio" id="mental2" name="mental2" value="2" v-model="postMatch.mental" />
      <label for="mental3">3</label>
      <input type="radio" id="mental3" name="mental3" value="3" v-model="postMatch.mental" />
      <label for="mental4">4</label>
      <input type="radio" id="mental4" name="mental4" value="4" v-model="postMatch.mental" />
      <label for="mental5">5</label>
      <input type="radio" id="mental5" name="mental5" value="5" v-model="postMatch.mental" />
      <br />
      <input type="submit" value="Submit" />
    </form>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      champions: [],
      preMatchFormSubmitted: false,
      preMatch: {
        summonerName: '',
        tag: '',
        goal: '',
        gameMode: '',
        lane: '',
        myChampion: null,
        opponentChampion: null
      },
      postMatch: {
        lesson: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.preMatchFormSubmitted = true
      // Handle form submission here
    },
    async handleSubmit() {
      const combinedData = { ...this.preMatch, ...this.postMatch }
      console.log(combinedData)
    }
  },
  async created() {
    const response = await axios.get(
      'https://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json'
    )
    this.champions = Object.values(response.data.data)
  }
}
</script>
