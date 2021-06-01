<template>
    <div class="container">
    <div class="innerContainer">
        <h2 style="font-size: 18px;">Recommendations Based on Your Activity</h2>
        <p v-if="!fetched">Loading...</p>
        <div class="results" v-if="fetched">   
            <div class="result" @click="setVideo(recommendations[index])" v-for="(object,index) in recommendations" v-bind:key="index">
                <img class="image" v-bind:src="recommendations[index].snippet.thumbnails.default.url">
                <button class="nBtn">{{ index + 1 }}</button>
                <button v-on:click.stop @click="addToList(recommendations[index])" class="oBtn">+</button>
                <p class="title">{{ recommendations[index].snippet.title }}</p>
            </div>
        </div>
        <br>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
    name: "recommended",
    components: {
        
    },
    data() {
        return {
            recommendations: [],
            apiKey: "",
            fetched: false
        }
    },
    methods: {
        setVideo: function(video) {
            if(this.shuffle) {
                this.CLEAR_VIDEO();
                this.SET_SHUFFLE(false);
            }
            this.SET_LIST("");
            this.SET_VIDEO(video);
        },
        addToList: function(video) {
            this.LIST_ADDER(video);
        },
        ...mapMutations([
            'SET_VIDEO',
            'SET_LIST',
            'CLEAR_VIDEO',
            'SET_SHUFFLE',
            'LIST_ADDER'
        ])
    },
    computed: {
        ...mapState([
            'shuffle'
        ])
    },
    async mounted() {
        if(this.$cookie.get('public_key') == "true") {
            this.apiKey = process.env.VUE_APP_APIKEY;
        } else {
            if(this.$cookie.get('api_key') && this.$cookie.get('api_key')!="") {
                this.apiKey = this.$cookie.get('api_key');
            } else {
                alert("You need to setup YouTube API key from the settings!");
            }
        }
        if(!this.$cookie.get('loggedin')) {
            this.$router.push('/home');
        }
        
        await axios(process.env.VUE_APP_SERVER_ADDRESS + '/history', {
            method: "get",
            withCredentials: true
        }).then(async (response) => {
            let topResults = response.data[0].videos;
            topResults.sort((a, b) => b.count - a.count);
            for(let x = 0; x < 5; x++) {
                if(topResults[x]) {
                    await axios.get("https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=" + topResults[x].video.id.videoId + "&type=video&key=" + this.apiKey + "&topicId=/m/04rlf&maxResults=5")
                    .then((response) => {
                        for(let i = 0; i < response.data.items.length; i++) {
                            if(response.data.items[i].snippet) {
                                this.recommendations.push(response.data.items[i]);
                            }
                        }
                    });
                }
            }
        });
        console.log("done");
        this.fetched = true;
    }
}
</script>

<style scoped>
.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    margin-top: 55px;
    margin-bottom: 90px;
}
.innerContainer {
    margin-left: 10vw;
    margin-right: 10vw;
}
.results {
    
}
.result {
    background-color: rgb(30, 30, 30);
    margin: 5px auto 5px auto;
    height: 50px;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: pointer;
}
.result:hover {
    background-color: rgb(27, 27, 27);
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
    background-color: rgb(30, 30, 30);
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
    background-color: rgb(27, 27, 27);
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