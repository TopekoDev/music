<template>
    <div>
        <div class="search">
            <input v-on:keyup.enter="search" class="searchBar" v-model="searchField" placeholder="Search YouTube.." type="text">
            <button class="searchBtn" v-on:click="search">Search</button>
        </div>
            <div class="results">
                <div class="result" v-on:click="setVideo(searchResults[index])" v-for="(object,index) in searchResults" v-bind:key="index">
                <img class="image" v-bind:src="searchResults[index].snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button class="oBtn">···</button>
                <p class="title">{{ searchResults[index].snippet.title }}</p>
            </div>
            <button v-if="searchResults.length > 0" class="loadBtn" v-on:click="loadMore">Load more</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import searchYoutube from 'youtube-api-v3-search';

import { mapMutations } from 'vuex';

export default {
    name: "home",
    components: {
        
    },
    data() {
        return {
            searchField: "",
            searchTerm: "",
            searchResults: [],
            nextPage: "",
        }
    },
    methods: {
        search: async function() {
            this.searchTerm = this.searchField;
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10
            }
            var results = await searchYoutube("AIzaSyBajJPriFZZDdjW53pTQvxdF6HpWb1cC7E", options);
            this.searchResults = results.items;
            this.nextPage = results.nextPageToken;
        },
        loadMore: async function() {
            this.searchTerm = this.searchField;
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10,
                pageToken: this.nextPage
            }
            var results = await searchYoutube("AIzaSyBajJPriFZZDdjW53pTQvxdF6HpWb1cC7E", options);
            this.nextPage = results.nextPageToken;
            this.searchResults = this.searchResults.concat(results.items);
        },
        setVideo: function(video) {
            this.SET_VIDEO(video);
        },
        ...mapMutations([
            'SET_VIDEO'
        ])
    },
    computed: {

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
.search {
    background-color: none;
    max-width: 500px;
    padding: 0 10px 0 10px;
    margin: auto;
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
.loadBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    cursor: pointer;
    display: block;
    margin: 10px auto 10px auto;
    padding: 10px 30px 10px 30px;
    border-radius: 20px;
}
.results {
    padding-bottom: 90px;
}
.result {
    background-color: rgb(20, 20, 20);
    margin: 5px auto;
    height: 50px;
    max-width: 650px;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: pointer;
}
.result:hover {
    background-color: rgb(25, 25, 25);
}
.image {
    height: 100%;
    border-radius: 5px 0 0 5px;
}
.title {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px 0 0px;
}
.nBtn {
    background-color: rgb(20, 20, 20);
    border: none;
    color: rgb(196, 196, 196);
    height: 100%;
    min-width: 40px;
    font-size: 13px;
}
.result:hover .nBtn {
    display: none;
}
.result:hover .oBtn {
    display: block;
}
.oBtn {
    background-color: rgb(25, 25, 25);
    border: none;
    color: rgb(196, 196, 196);
    height: 100%;
    min-width: 40px;
    font-size: 18px;
    cursor: pointer;
    display: none;
}
.oBtn:hover {
    color: white;
}
</style>