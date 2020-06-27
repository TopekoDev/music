<template>
    <div class="container">
        <input id="listName" autocomplete="off" name="name" type="text" placeholder="" v-model="listName" />
        <p id="listInfo">{{ songs.length }} songs</p>
        <button id="listConfirm" v-on:click="editList()"><SaveIcon class="icons" /></button>
        <button id="listCancel" v-on:click="cancel()"><XSquareIcon class="icons" /></button>
        <button id="listRemove" v-on:click="confirmation=true"><TrashIcon class="icons" /></button>
        <div class="results">
            <p>Sort items by dragging. Remove items by clicking the trash can.</p>
            <div class="result" v-for="(object,index) in songs" v-bind:key="index" draggable="true" v-on:dragstart="dragStart(songs[index].order)" v-on:dragend="dragEnd()" v-on:dragover="dragOver(songs[index].order)">
                <div v-if="target == index+1 && target < draggable" id="lineA"></div>
                <div v-if="target == index+1 && target > draggable" id="line"></div>
                <img class="image" v-bind:src="songs[index].video.snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop v-on:click="removeVideo(songs[index].id)" class="oBtn">🗑️</button>
                <p class="title">{{ songs[index].video.snippet.title }}</p>
            </div>
        </div>

        <div class="removeConfirm" v-if="confirmation">
            <div id="confirmBG">
                <div class="confirm">
                    <p>Remove list?</p>
                    <p>This cannot be undone!</p>
                    <button id="remove" v-on:click="removeList()">Remove</button>
                    <button id="cancel" v-on:click="confirmation=false;">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import { TrashIcon, SaveIcon, XSquareIcon } from 'vue-feather-icons';

export default {
    name: "listeditor",
    components: {
        TrashIcon, SaveIcon, XSquareIcon
    },
    data() {
        return {
            listId: "",
            songs: [],
            listName: "",
            draggable: null,
            target: null,
            toRemove: [],
            confirmation: false
        }
    },
    methods: {
        getVideos: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.songs = theUser.data[0].added_videos.filter(x => x.list === this.listId);
            this.songs.sort((a, b) => a.order - b.order);
            this.listName = theUser.data[0].lists.filter(x => x.id === this.listId)[0].name;
        },
        cancel: function() {
            this.$router.push('/list?l=' + this.listId);
        },
        removeVideo: async function(theId) {
            this.toRemove.push(theId);
            var removeIndex = this.songs.map(function(a) { return a.id; }).indexOf(theId);
            console.log(removeIndex);
            for(let i = removeIndex; i < this.songs.length; i++) {
                this.songs[i].order -= 1;
            }
            this.songs.splice(removeIndex, 1);
            this.songs.sort((a, b) => a.order - b.order);
        },
        removeList: async function() {
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                method: "post",
                data: {type: 'list', id: this.listId},
                withCredentials: true
            });
            console.log(response);
            this.$router.push('/home');
        },
        editList: async function() {
            for(let i = 0; i < this.toRemove.length; i++) {
                await axios(process.env.VUE_APP_SERVER_ADDRESS + '/remove', {
                    method: "post",
                    data: {type: 'video', id: this.toRemove[i]},
                    withCredentials: true
                });
            }
            await axios(process.env.VUE_APP_SERVER_ADDRESS + '/edit', {
                method: "post",
                data: {type: 'list', items: this.songs},
                withCredentials: true
            });
            await axios(process.env.VUE_APP_SERVER_ADDRESS + '/edit', {
                method: "post",
                data: {type: 'listname', id: this.listId, list: this.listName},
                withCredentials: true
            });
            this.CLEAR_VIDEO();
            this.SET_SHUFFLE(false);
            this.$router.push('/list?l=' + this.listId);
        },
        dragStart: function(item) {
            this.draggable = item;
            this.target = item;
        },
        dragEnd: function() {
            if(this.target != this.draggable) {
                if(this.target < this.draggable) {
                    for(let i = this.target-1; i < this.draggable-1; i++) {
                        this.songs[i].order += 1;
                    }
                    this.songs[this.draggable-1].order = this.target;
                } else {
                    for(let i = this.target-1; i > this.draggable-1; i--) {
                        this.songs[i].order -= 1;
                    }
                    this.songs[this.draggable-1].order = this.target;
                }
                this.songs.sort((a, b) => a.order - b.order);
                this.target = null;
                this.draggable = null;
            }
        },
        dragOver: function(item) {
            this.target = item;
        },
        ...mapMutations([
            'CLEAR_VIDEO',
            'SET_SHUFFLE'
        ]),
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
.removeConfirm {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    padding-top: 40vh;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
}
.removeConfirm #remove {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: white;
    cursor: pointer;
    margin-right: 12px;
}
.removeConfirm #cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-left: 12px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
}
.removeConfirm #confirmBG {
    background-color: rgb(30, 30, 30);
    width: 300px;
    height: auto;
    padding: 20px;
    margin: auto;
    border-radius: 10px;
}

#listName {
    background-color:rgb(30, 30, 30);
    font-size: 20px;
    border: none;
    color: white;
    height: 35px;
    width: 225px;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}
#listInfo {
    font-size: 15px;
    color: rgb(139, 139, 139);
    margin: 5px 0 0 0;
}
#listConfirm {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: white;
    margin: 20px 5px 10px 0;
    cursor: pointer;
}
#listCancel {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 20px 10px 20px;
    color: white;
    margin: 20px 5px 10px 0;
    cursor: pointer;
}
#listRemove {
    background-color: rgb(73, 73, 73);
    border: none;
    border-radius: 10px;
    padding: 10px 20px 10px 20px;
    color: white;
    margin: 20px 5px 10px 0;
    cursor: pointer;
}

.icons {
    width: 16px;
    height: 16px;
    margin-bottom: -3px;
}
.results {
    padding-bottom: 100px;
}
#line {
    border-bottom: 2px solid rgb(168, 61, 61);
    width: 76.5%;
    position: absolute;
    display: block;
    margin-top: 52px;
}
#lineA {
    border-bottom: 2px solid rgb(168, 61, 61);
    width: 76.5%;
    position: absolute;
    display: block;
    margin-top: -52px;
}
.result {
    background-color: rgb(20, 20, 20);
    margin: 5px auto 5px auto;
    height: 50px;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: move;
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
    font-size: 15px;
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