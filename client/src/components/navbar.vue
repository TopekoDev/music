<template>
    <div class="navbar">
        <div class="items">
            <a v-on:click="navigate('home')"><HomeIcon class="icon"/>Home</a>
            <a v-on:click="navigate('settings')"><SettingsIcon class="icon"/>Settings</a>
        </div>
        <div class="search">
            <input v-on:keyup.enter="search" id="searchBar" v-model="searchField" placeholder="Search YouTube or lists..." type="text">
            <button class="searchBtn" v-on:click="search"><SearchIcon id="sIcon"/></button>
        </div>
    </div>
</template>

<script>
import { SearchIcon, HomeIcon, SettingsIcon } from 'vue-feather-icons';

export default {
    name: "navbar",
    components: {
        SearchIcon, HomeIcon, SettingsIcon
    },
    data() {
        return {
            searchField: ""
        }
    },
    methods: {
        search: function() {
            if(this.searchField != "") {
                this.$router.push('/search?q=' + this.searchField);
            }
        },
        navigate: function(route) {
            this.$router.push('/' + route);
        }
    }
}
</script>

<style scoped>
.navbar {
    background-color: rgb(25, 25, 25);
    width: 100%;
    position: fixed;
    top: 0;
    display: flex;
    height: 55px;
}
.items {
    margin-left: 10vw;
    float: left;
    width: 300px;
}
.navbar a {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 15px 30px 16px 0;
    text-decoration: none;
    cursor: pointer;
    font-size: 15px;
}
.navbar a:hover {
    color: rgb(168, 61, 61);
}
.icon {
    height: 23px;
    width: 23px;
    margin-bottom: -5px;
    margin-right: 5px;
}
.search {
    margin-right: 10vw;
    flex: 1;
    float: right;
}
#searchBar {
    float: right;
    width: 100%;
    background-color: rgb(15, 15, 15);
    font-size: 15px;
    border: none;
    height: 35px;
    color: rgb(212, 212, 212);
    border-radius: 10px 10px 10px 10px;
    padding: 0 50px 0 15px;
    margin-top: 10px;
}
#sIcon {
    width: 18px;
    height: 18px;
    margin-bottom: -3px;
    margin-right: 2px;
}
.searchBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    height: 35px;
    width: 45px;
    position: absolute;
    right: 10vw;
    top: 10px;
}
@media (max-width: 860px) {
    .items {
        width: 155px;
    }
    .navbar a {
        font-size: 0;
        padding: 15px 15px 16px 0;
    }
}
</style>