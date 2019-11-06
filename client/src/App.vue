<template>
  <div>
    <div class="container">
      <router-view/>
      <player v-if="$router.currentRoute.path!='/hello'"/>
    </div>
  </div>
</template>

<script>
import player from './components/player';
export default {
  name: 'app',
  components: {
    player
  },
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
