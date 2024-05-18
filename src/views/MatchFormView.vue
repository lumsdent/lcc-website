<template>
  <main>
    <h1>Insert a new Match Id</h1>
    <input type="text" v-model="textInput" placeholder="Enter match here" />
    <button @click="submitMatch">Submit</button>
  </main>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const textInput = ref('')

const submitMatch = async () => {
  const response = await axios.post('http://127.0.0.1:5000/add_match', {
    match_id: textInput.value
  })
  console.log(response.data)
}
</script>


