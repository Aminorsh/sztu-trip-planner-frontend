<template>
  <header class="app-header">
    <div class="logo">Travel Planner</div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/dashboard">My Trips</router-link>
      <router-link to="/profile">Profile</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f5f5f5;
}
nav a {
  margin-left: 1rem;
}
</style>
