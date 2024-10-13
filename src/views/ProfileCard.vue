<template>
    <div class="profile-card">
      <img :src="profilePicture" alt="Profile Picture" class="profile-picture" />
      <h2 class="profile-title">{{ title }}</h2>
      <p class="profile-description">{{ description }}</p>
      <ul class="profile-matches">
        <li v-for="match in matches" :key="match">
          <span>{{ match }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfileCard',
    props: {
      profilePicture: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: Number,
        required: true
      },
      matches: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    max-width: 300px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-picture {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }
  
  .profile-title {
    margin: 16px 0 8px;
    font-size: 1.5em;
  }
  
  .profile-description {
    color: #666;
  }

  .profile-matches li {
    margin: 8px 0;
  }
  </style>