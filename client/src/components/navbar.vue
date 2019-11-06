<template>
    <div class="navbar">
        <div class="search">
            <input v-on:keyup.enter="search" class="searchBar" v-model="searchField" placeholder="Search YouTube.." type="text">
            <button class="searchBtn" v-on:click="search">Search</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "navbar",
    components: {
        
    },
    data() {
        return {
            searchField: ""
        }
    },
    methods: {
        search: function() {
            this.$router.push('/search?s=' + this.searchField);
        },
    }
}
</script>

<style scoped>
.navbar {
    background-color: transparent;
    width: 100%;
}

.search {
    background-color: none;
    max-width: 500px;
    padding: 10px 10px 10px 10px;
    display: flex;
}
.searchBar {
    background-color:rgb(25, 25, 25);
    font-size: 15px;
    border: none;
    color: white;
    height: 40px;
    min-width: 20px;
    flex: 1;
    padding: 0 15px 0 15px;
    border-radius: 20px 0 0 20px;
}
.searchBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    padding-right: 12px;
}
</style>