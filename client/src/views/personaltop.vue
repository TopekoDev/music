<template>
    <div class="container">
    <div class="innerContainer">
        <h2 style="font-size: 18px;">What You've Listened to The Most</h2>
        <div class="results">    
            <div class="result" @click="setVideo(topResults[index].video)" v-for="(object,index) in topResults" v-bind:key="index">
                <img class="image" v-bind:src="topResults[index].video.snippet.thumbnails.default.url">
                <button class="nBtn">{{ topResults[index].count }}</button>
                <button v-on:click.stop @click="addToList(topResults[index].video)" class="oBtn">+</button>
                <p class="title">{{ topResults[index].video.snippet.title }}</p>
            </div>
            <button v-if="allResults.length > 0" id="loadBtn" @click="loadMore">Load more</button>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
    name: "top",
    components: {
        
    },
    data() {
        return {
            topResults: [],
            allResults: [],
            nextPage: "",
            apiKey: ""
        }
    },
    methods: {
        init: async function() {
            if(!this.$cookie.get('loggedin')) {
                this.$router.push('/home');
            } else {
                this.getHistory();
            }
        },
        getHistory: async function() {
            const theResults = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/history', {
                method: "get",
                withCredentials: true
            });
            this.allResults = theResults.data[0].videos;
            this.allResults.sort((a, b) => b.count - a.count);
            this.loadMore();
        },
        loadMore: function() {
            let newArr = this.allResults.slice();
            for(let i = 0; i < 10; i++) {
                if(this.allResults[i]) {
                    this.topResults.push(this.allResults[i]);
                    newArr.splice(0,1);
                }
            }
            this.allResults = newArr;
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
    mounted() {
        this.init();
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