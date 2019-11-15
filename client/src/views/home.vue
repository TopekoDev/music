<template>
    <div class="container">
        <div v-if="!loggedIn" class="login">
            <p>If you want to add songs to a playlist <a href="/login">Login</a> or <a href="/register">Create account</a>.</p>
            <p>You can search and play music normally without an account :)</p>
        </div>
        <div v-if="loggedIn">
            <p>Recently played:</p>
            <div v-if="historyLog" class="results">
                <div class="result" v-on:click="setVideo(songs[index])" v-for="(object,index) in songs" v-bind:key="index">
                    <img class="image" v-bind:src="songs[index].snippet.thumbnails.default.url">
                    <button class="nBtn">{{ index+1 }}</button>
                    <button v-on:click.stop v-on:click="addVideo(songs[index])" class="oBtn">+</button>
                    <p class="title">{{ songs[index].snippet.title }}</p>
                </div>
            </div>
            <p v-if="songs.length <= 0 && historyLog" style="color: grey; font-size: 13px;">No history yet</p>
            <p v-if="!historyLog" style="color: grey; font-size: 13px;">Listening history can be enabled from the settings</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
    name: "home",
    components: {
        
    },
    data() {
        return {
            loggedIn: false,
            songs: [],
            rankedSongs: [],
            historyLog: Boolean
        }
    },
    methods: {
        getVideos: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            var history = theUser.data[0].history;
            this.songs = history.reverse().slice(0,5);
        },
        setVideo: function(video) {
            this.SET_VIDEO(video);
        },
        addVideo: async function(video) {
            var theVid = video;
            theVid.date = new Date;
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/add', {
                method: "post",
                data: {video: theVid},
                withCredentials: true
            });
            alert("added to list");
        },
        ...mapMutations([
            'SET_VIDEO'
        ])
    },
    created() {
        if(this.$cookie.get('loggedin')=="true") {
            this.loggedIn = true;
            this.getVideos();
        } else {
            this.loggedIn = false;
        }
        if(this.$cookie.get('log_history')) {
            this.historyLog = true;
        } else {
            this.historyLog = false;
        }
    }
}
</script>

<style scoped>
.results {
    
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
.container {
    /* +180px from left is the sidebar width */
    margin-left: 200px;
    margin-right: 20px;
    margin-top: 80px;
}
@media (max-width: 860px) {
    .container {
        margin-top: 75px;
        margin-left: 75px;
        margin-right: 10px;
    }
}
@media (max-width: 500px) {
    .nBtn {
        display: none;
    }
    .oBtn {
        display: block;
        background-color: rgb(20, 20, 20);
    }
    .result:hover .oBtn {
        background-color: rgb(25, 25, 25);
    }
}
</style>