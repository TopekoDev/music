<template>
    <div class="navbar">
        <div class="search">
            <input v-on:keyup.enter="search" class="searchBar" v-model="searchField" placeholder="Search from YouTube.." type="text">
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
            this.$router.push('/search?q=' + this.searchField);
        }
    }
}
</script>

<style scoped>
.navbar {
    background-color: rgb(30, 30, 30);
    width: 100%;
    position: fixed;
    top: 0;
}

.search {
    background-color: none;
    max-width: 500px;
    padding: 15px 10px 15px 10px;
    display: flex;
    margin: auto;

}
.searchBar {
    background-color:rgb(15, 15, 15);
    font-size: 15px;
    border: none;
    color: rgb(212, 212, 212);
    height: 35px;
    min-width: 20px;
    flex: 1;
    padding: 0 15px 0 15px;
    border-radius: 10px 0 0 10px;
}
.searchBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    padding-right: 10px;
}
@media (max-width: 860px) {
    .navbar {
        z-index: 1;
    }
}
</style>