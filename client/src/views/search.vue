<template>
    <div class="container">
        <div class="results">
            <div class="result" @click="setVideo(searchResults[index])" v-for="(object,index) in searchResults" v-bind:key="index">
                <img class="image" v-bind:src="searchResults[index].snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop @click="addToList(searchResults[index])" class="oBtn">+</button>
                <p class="title">{{ searchResults[index].snippet.title }}</p>
            </div>
            <button v-if="searchResults.length > 0" id="loadBtn" @click="loadMore">Load more</button>
        </div>
        <div id="listAdd">
            <div id="listAddBG">
                <p style="margin: 0 0 10px 0; padding: 0;">Add to list</p>
                <div class="innerlist">
                    <div v-for="(object,index) in lists" v-bind:key="index">
                        <button class="list" @click="addVideo(selectedVideo, lists[index]._id)">{{ lists[index].name }}</button>
                    </div>
                    <br>
                </div>
                <button id="cancel" @click="addVideoDialog(false)">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import searchYoutube from 'youtube-api-v3-search';
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
    name: "search",
    components: {
        
    },
    data() {
        return {
            searchTerm: "",
            searchResults: [],
            nextPage: "",
            apiKey: "",
            selectedVideo: "",
            lists: []
        }
    },
    methods: {
        search: async function() {
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10,
                pageToken: ''
            }
            var results = await searchYoutube(this.apiKey, options);
            this.searchResults = results.items;
            this.nextPage = results.nextPageToken;
        },
        loadMore: async function() {
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10,
                pageToken: this.nextPage
            }
            var results = await searchYoutube(this.apiKey, options);
            this.searchResults = this.searchResults.concat(results.items);
            this.nextPage = results.nextPageToken;
        },
        setVideo: function(video) {
            if(this.shuffle) {
                this.CLEAR_VIDEO();
                this.SET_SHUFFLE(false);
            }
            this.SET_LIST("");
            this.SET_VIDEO(video);
        },
        addToList: function(video) {
            this.selectedVideo = video;
            this.getUserLists();
            this.addVideoDialog(true);
        },
        getUserLists: async function() {
            const theLists = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/userlists', {
                method: "get",
                withCredentials: true
            });
            this.lists = theLists.data;
            this.lists.sort(function(a, b) { 
                return a.name > b.name ? 1 : -1;
            });
        },
        addVideoDialog: function(state) {
            let element = document.getElementById("listAdd");
            if(state) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        },
        addVideo: async function(video, theList) {
            let theVid = video;
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/addvideo', {
                method: "post",
                data: {list: theList, video: theVid},
                withCredentials: true
            });
            this.addVideoDialog(false);
            this.selectedVideo = "";
            console.log(response);
        },
        ...mapMutations([
            'SET_VIDEO',
            'SET_LIST',
            'CLEAR_VIDEO',
            'SET_SHUFFLE'
        ])
    },
    computed: {
        ...mapState([
            'shuffle'
        ])
    },
    mounted() {
        switch(this.$cookie.get('public_key')) {
            case "true":
                this.apiKey = process.env.VUE_APP_APIKEY;
                break;
            case "false": default:
                if(this.$cookie.get('api_key') && this.$cookie.get('api_key')!="") {
                    this.apiKey = this.$cookie.get('api_key');
                } else {
                    alert("You need to setup YouTube API key from the settings!");
                }
                break;
        }
        this.searchTerm = this.$route.query.q;
        if(this.searchTerm != "") {
            this.search();
        }
    },
    watch: {
        $route() {
            if(this.$cookie.get('public_key')) {
                this.apiKey = process.env.VUE_APP_APIKEY;
            } else {
                if(this.$cookie.get('api_key') && this.$cookie.get('api_key')!="") {
                    this.apiKey = this.$cookie.get('api_key');
                } else {
                    alert("You have to specify YouTube API key in the settings!");
                }
            }
            this.searchTerm = this.$route.query.q;
            this.search();
        }
    }
}
</script>

<style scoped>
#listAdd {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    padding-top: 30vh;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
}
.innerlist {
    overflow-y: scroll;
    max-height: 220px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.innerlist::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
#listAddBG {
    background-color: rgb(25, 25, 25);
    width: 300px;
    height: auto;
    padding: 20px;
    margin: auto;
    border-radius: 10px;
}
.list {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    width: 200px;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 10px 0 0 5px;
}
#cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-top: 10px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
}
.container {
    margin-left: 10vw;
    margin-right: 10vw;
    margin-top: 80px;
}
#loadBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    cursor: pointer;
    display: block;
    margin: 20px auto 20px auto;
    padding: 10px 30px 10px 30px;
    border-radius: 20px;
    font-size: 15px;
}
.results {
    padding-bottom: 90px;
}
.result {
    background-color: rgb(20, 20, 20);
    margin: 5px auto 5px auto;
    height: 50px;
    width: 100%;
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