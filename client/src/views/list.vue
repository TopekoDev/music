<template>
    <div class="container">
        <p id="listName">{{ listName }}</p>
        <p id="listInfo">{{ videos.length }} tracks</p>
        <button id="listPlay" v-on:click="playList(0)">Play</button>
        <button id="listShuffle" v-on:click="shuffleList()"><ShuffleIcon class="icons"/></button>
        <button id="listEdit" v-on:click="editList()"><Edit2Icon class="icons"/></button>
        <div class="results">
            <div class="result" v-on:click="playList(index)" v-for="(object,index) in videos" v-bind:key="index">
                <img class="image" v-bind:src="videos[index].video.snippet.thumbnails.medium.url">
                <button class="nBtn">{{ index+1 }}</button>
                <p v-if="!shuffle && (index != videos.length - queue.length - 1 || list != listId)" class="title">{{ videos[index].video.snippet.title }}</p>
                <p v-if="!shuffle && (index == videos.length - queue.length - 1 && list == listId)" class="title" style="color: rgb(168, 61, 61);">{{ videos[index].video.snippet.title }}</p>
                <p v-if="shuffle && (index != shuffledList[shuffledList.length - queue.length -1 ].order -1 || list != listId)" class="title">{{ videos[index].video.snippet.title }}</p>
                <p v-if="shuffle && (index == shuffledList[shuffledList.length - queue.length -1].order -1 && list == listId)" class="title" style="color: rgb(168, 61, 61);">{{ videos[index].video.snippet.title }}</p>
            </div>
        </div>
        <p v-if="shuffle" id="shuffleText">Shuffling...</p>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import { ShuffleIcon, Edit2Icon } from 'vue-feather-icons';

export default {
    name: "list",
    components: {
        ShuffleIcon, Edit2Icon
    },
    data() {
        return {
            listId: "",
            videos: [],
            listName: "",
            listOwner: ""
        }
    },
    methods: {
        playList: function(index) {
            if(this.videos.length > 0) {
                if(this.shuffle) {
                    this.CLEAR_VIDEO();
                    this.SET_SHUFFLE(false);
                }
                this.SET_LIST(this.listId);
                this.SET_VIDEO(this.videos[index].video);
                for(let i = index-1; i >= 0; i--) {
                    this.HISTORY_VIDEO(this.videos[i].video);
                }
                for(let i = this.videos.length-1; i > index; i--) {
                    this.QUEUE_VIDEO(this.videos[i].video);
                }
            }
        },
        shuffleList: function() {
            if(this.videos.length > 0) {
                this.CLEAR_VIDEO();
                var shuffledvideos = this.videos.slice().sort(() => Math.random() - 0.5);
                this.SET_SHUFFLE(true);
                this.SET_SHUFFLE_LIST(shuffledvideos);
                this.SET_LIST(this.listId);
                this.SET_VIDEO(shuffledvideos[0].video);
                for(let i = shuffledvideos.length-1; i > 0; i--) {
                    this.QUEUE_VIDEO(shuffledvideos[i].video);
                }
            }
        },
        getVideos: async function() {
            const theList = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/list', {
                method: "post",
                data: {list: this.listId},
                withCredentials: true
            });
            this.videos = theList.data[0].videos;
            this.videos.sort((a, b) => a.order - b.order);
            this.listName = theList.data[0].name;
            this.listOwner = theList.data[0].owner;
        },
        editList: function() {
            this.$router.push('/edit?l=' + this.listId);
        },
        ...mapMutations([
            'SET_VIDEO',
            'QUEUE_VIDEO',
            'HISTORY_VIDEO',
            'SET_LIST',
            'SET_SHUFFLE',
            'SET_SHUFFLE_LIST',
            'CLEAR_VIDEO'
        ])
    },
    computed: {
        ...mapState([
            'ytInfo',
            'queue',
            'history',
            'list',
            'shuffle',
            'shuffledList'
        ])
    },
    mounted() {
        this.listId = this.$route.query.l;
        this.getVideos();
    },
    watch: {
        $route() {
            this.listId = this.$route.query.l;
            this.getVideos();
        },
    }
}
</script>

<style scoped>
#shuffleText {
    margin-top: -120px;
    color: rgb(139, 139, 139);
}
#listName {
    font-size: 30px;
    margin: 0;
    word-wrap: break-word;
}
#listInfo {
    font-size: 15px;
    color: rgb(139, 139, 139);
    margin: 5px 0 0 0;
}
#listPlay {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    height: 38px;
    color: white;
    margin: 10px 5px 0 0;
    cursor: pointer;
    font-size: 15px;
}
#listShuffle {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    height: 38px;
    color: white;
    margin: 10px 5px 0 0;
    cursor: pointer;
}
#listEdit {
    background-color: rgb(73, 73, 73);
    border: none;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    height: 38px;
    color: white;
    margin: 10px 5px 0 0;
    cursor: pointer;
}
.icons {
    width: 16px;
    height: 16px;
    margin-bottom: -3px;
}
.results {
    padding: 10px 0 120px 0;
}
.result {
    background-color: rgb(20, 20, 20);
    margin: 5px auto 5px auto;
    height: 45px;
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
    cursor: pointer;
}
.result:hover .nBtn {
    color: white;
    background-color: rgb(25, 25, 25);
}
.container {
    margin-left: 10vw;
    margin-right: 10vw;
    margin-top: 80px;
}
</style>