<script>
import axios from 'axios'
export default {
  data() {
    return {
      matches: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await axios
        .get('http://127.0.0.1:5000/get_all_matches')
        .then((response) => {
          this.matches = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.match_id">
          <td>{{ match.match_id }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
