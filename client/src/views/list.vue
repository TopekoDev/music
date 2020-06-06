<template>
    <div class="container">
        <p id="listName">{{ listName }}</p>
        <p id="listInfo">{{ songs.length }} songs</p>
        <button id="listPlay" v-on:click="playList(0)">Play</button>
        <button id="listRemove" v-on:click="removeList()">Delete</button>
        <div class="results">
            <div class="result" v-on:click="playList(index)" v-for="(object,index) in songs" v-bind:key="index">
                <img class="image" v-bind:src="songs[index].video.snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop v-on:click="removeVideo(songs[index].date)" class="oBtn">-</button>
                <p v-if="index != songs.length - queue.length - 1 || list != listId" class="title">{{ songs[index].video.snippet.title }}</p>
                <p v-if="index == songs.length - queue.length - 1 && list == listId" class="title" style="color: rgb(168, 61, 61);">{{ songs[index].video.snippet.title }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
    name: "list",
    components: {
        
    },
    data() {
        return {
            listId: "",
            songs: [],
            listName: "",
        }
    },
    methods: {
        playList: function(index) {
            this.SET_LIST(this.listId);
            this.SET_VIDEO(this.songs[index].video);
            for(let i = index-1; i >= 0; i--) {
                this.HISTORY_VIDEO(this.songs[i].video);
            }
            for(let i = this.songs.length-1; i > index; i--) {
                this.QUEUE_VIDEO(this.songs[i].video);
            }
        },
        getVideos: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.songs = theUser.data[0].added_videos.filter(x => x.list === this.listId);
            this.listName = theUser.data[0].lists.filter(x => x.id === this.listId)[0].name;
        },
        removeVideo: async function(addDate) {
            if(confirm("Remove From List? Cannot be undone!")) {
                const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                    method: "post",
                    data: {type: 'video', date: addDate},
                    withCredentials: true
                });
                console.log(response);
                this.getVideos();
            }
        },
        removeList: async function() {
            if(confirm("Delete List? Cannot be undone!")) {
                const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                    method: "post",
                    data: {type: 'list', id: this.listId},
                    withCredentials: true
                });
                console.log(response);
                this.$router.push('/home');
            }
        },
        ...mapMutations([
            'SET_VIDEO',
            'QUEUE_VIDEO',
            'HISTORY_VIDEO',
            'SET_LIST'
        ])
    },
    computed: {
        ...mapState([
            'ytInfo',
            'queue',
            'history',
            'list'
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
    padding: 10px 30px 10px 30px;
    color: white;
    margin: 20px 15px 10px 0;
    cursor: pointer;
}
#listRemove {
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: rgb(139, 139, 139);
    cursor: pointer;
}
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