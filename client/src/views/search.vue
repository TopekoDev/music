<template>
    <div>
        <navbar/>
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
import navbar from '../components/navbar';

import { mapMutations } from 'vuex';

export default {
    name: "search",
    components: {
        navbar
    },
    data() {
        return {
            searchTerm: "",
            searchResults: [],
            nextPage: "",
        }
    },
    methods: {
        search: async function() {
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
    created() {
        this.searchTerm = this.$route.query.s;
        this.search();
    },
    computed: {

    }
}
</script>

<style scoped>
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
    padding: 30px 0 90px 0;
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