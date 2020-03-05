<template>
    <div class="container">
        <p>Songs on your list:</p>
        <div class="results">
            <div class="result" v-on:click="setVideo(songs[index].video)" v-for="(object,index) in songs" v-bind:key="index">
                <img class="image" v-bind:src="songs[index].video.snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop v-on:click="removeVideo(songs[index].date)" class="oBtn">-</button>
                <p class="title">{{ songs[index].video.snippet.title }}</p>
            </div>
        </div>
        <button v-on:click="removeList()">Remove list</button>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
    name: "list",
    components: {
        
    },
    data() {
        return {
            listId: "",
            songs: []
        }
    },
    methods: {
        setVideo: function(video) {
            this.SET_VIDEO(video);
        },
        getVideos: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.songs = theUser.data[0].added_videos.filter(x => x.list === this.listId);
        },
        removeVideo: async function(addDate) {
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                method: "post",
                data: {type: 'video', date: addDate},
                withCredentials: true
            });
            this.getVideos();
        },
        removeList: async function() {
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                method: "post",
                data: {type: 'list', id: this.listId},
                withCredentials: true
            });
            this.$router.push('/home');
        },
        ...mapMutations([
            'SET_VIDEO',
            'QUEUE_VIDEO'
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