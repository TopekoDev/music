<template>
  <div>
    <div class="container">
      <navbar v-if="!blacklist.includes($router.currentRoute.path)"/>
      <sidebar v-if="!blacklist.includes($router.currentRoute.path)"/>
      <router-view id="router"/>
      <player v-if="!blacklist.includes($router.currentRoute.path)"/>
    </div>
  </div>
</template>

<script>
import player from './components/player';
import navbar from './components/navbar';
import sidebar from './components/sidebar';
export default {
  name: 'app',
  components: {
    player,
    navbar,
    sidebar
  },
  data() {
    return {
      blacklist: ['/','/404','/register','/login']
    }
  },
  methods: {
    
  },
  created() {
    
  },
  updated() {
    
  }
}
</script>

<style>
h1 {
    color: white;
}
h2 {
    color: white;
}
p {
    color: white;
}
body {
    margin: 0;
    font-family:Arial, Helvetica, sans-serif;
    background-color: rgb(15, 15, 15);
}
</style>
