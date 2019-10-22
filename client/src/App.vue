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

</style>
