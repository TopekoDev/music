<template>
    <div class="sidebar">
        <p id="logo" v-on:click="home">TZMusic</p>
    </div>
</template>

<script>

export default {
    name: "sidebar",
    components: {
        
    },
    data() {
        return {
            
        }
    },
    methods: {
        home: function() {
            this.$router.push('/home');
        }
    }
}
</script>

<style scoped>
.sidebar {
    background-color: rgb(35, 35, 35);
    width: 18%;
    position: fixed;
    top: 0;
    height: 100%;
}
#logo {
    font-size: 20px;
    text-align: center;
    cursor: pointer;
}
</style>