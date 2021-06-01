<template>
    <div class="container" v-if="listOwner === userId">
    <div class="innerContainer">
        <input id="listName" autocomplete="off" name="name" type="text" placeholder="" v-model="listName" />
        <p id="listInfo">{{ videos.length }} tracks</p>
        <button id="listConfirm" v-on:click="editList()"><SaveIcon class="icons" /></button>
        <button id="listCancel" v-on:click="cancel()"><XSquareIcon class="icons" /></button>
        <button id="listRemove" v-on:click="confirmation=true"><TrashIcon class="icons" /></button>
        <div id="results" v-if="videos.length > 0">
            <p style="font-size: 17px">Sort items by dragging. Remove items by clicking "-".</p>
            <div class="result" v-for="(object,index) in videos" v-bind:key="index" draggable="true" v-on:dragstart="dragStart(videos[index].order)" v-on:dragend="dragEnd()" v-on:dragover="dragOver(videos[index].order)">
                <div v-if="target == index+1 && target < draggable" id="lineA"></div>
                <div v-if="target == index+1 && target > draggable" id="line"></div>
                <img class="image" v-bind:src="videos[index].video.snippet.thumbnails.medium.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop v-on:click="removeVideo(videos[index].id)" class="oBtn">-</button>
                <p class="title">{{ videos[index].video.snippet.title }}</p>
            </div>
        </div>
        <p style="color: grey;" v-if="videos.length < 1">List is empty!</p>

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
            videos: [],
            listName: "",
            draggable: null,
            target: null,
            toRemove: [],
            confirmation: false,
            listOwner: "",
            userId: ""
        }
    },
    methods: {
        init: async function() {
            this.listId = this.$route.query.l;
            await this.getVideos();
            await this.getUser();
            if(this.listOwner !== this.userId) {
                this.$router.push('/home');
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
        getUser: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.userId = theUser.data[0]._id;
        },
        cancel: function() {
            if(this.videos.length > 0) {
                this.$router.push('/list?l=' + this.listId);
            } else {
                this.$router.push('/home');
            }
        },
        removeVideo: async function(theId) {
            this.toRemove.push(theId);
            var removeIndex = this.videos.map(function(a) { return a.id; }).indexOf(theId);
            for(let i = removeIndex; i < this.videos.length; i++) {
                this.videos[i].order -= 1;
            }
            this.videos.splice(removeIndex, 1);
            this.videos.sort((a, b) => a.order - b.order);
        },
        removeList: async function() {
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/deletelist', {
                method: "post",
                data: {list: this.listId},
                withCredentials: true
            });
            console.log(response);
            this.$router.push('/home');
        },
        editList: async function() {
            if(this.toRemove.length > 0) {
                for(let i = 0; i < this.toRemove.length; i++) {
                    await axios(process.env.VUE_APP_SERVER_ADDRESS + '/deletevideo', {
                        method: "post",
                        data: {list: this.listId, video: this.toRemove[i]},
                        withCredentials: true
                    });
                }
            }
            await axios(process.env.VUE_APP_SERVER_ADDRESS + '/editlist', {
                method: "post",
                data: {list: this.listId, name: this.listName, videos: this.videos, public: this.listPublic},
                withCredentials: true
            });
            this.CLEAR_VIDEO();
            this.SET_SHUFFLE(false);
            if(this.videos.length > 0) {
                this.$router.push('/list?l=' + this.listId);
            } else {
                this.$router.push('/home');
            }
        },
        dragStart: function(item) {
            this.draggable = item;
            this.target = item;
        },
        dragEnd: function() {
            if(this.target != this.draggable) {
                if(this.target < this.draggable) {
                    for(let i = this.target-1; i < this.draggable-1; i++) {
                        this.videos[i].order += 1;
                    }
                    this.videos[this.draggable-1].order = this.target;
                } else {
                    for(let i = this.target-1; i > this.draggable-1; i--) {
                        this.videos[i].order -= 1;
                    }
                    this.videos[this.draggable-1].order = this.target;
                }
                this.videos.sort((a, b) => a.order - b.order);
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
        this.init();
    },
    watch: {
        $route() {
            this.init();
        },
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
.removeConfirm {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    padding-top: 35vh;
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
    background-color: rgb(25, 25, 25);
    width: 300px;
    height: auto;
    padding: 5px 20px 20px 20px;
    margin: auto;
    border-radius: 10px;
}

#listName {
    background-color: rgb(30, 30, 30);
    font-size: 20px;
    border: none;
    color: white;
    height: 35px;
    width: 225px;
    padding: 0 5px 0 5px;
    border-radius: 2px;
    margin-top: 30px;
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
    padding: 0 30px 0 30px;
    height: 38px;
    color: white;
    margin: 10px 5px 0 0;
    cursor: pointer;
}
#listCancel {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 0 30px 0 30px;
    height: 38px;
    color: white;
    margin: 10px 5px 0 0;
    cursor: pointer;
}
#listRemove {
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
#results {
    padding-bottom: 10px;
}
#line {
    height: 2px;
    width: 80vw;
    background-color: rgb(168, 61, 61);
    position: absolute;
    margin-top: 49px;
}
#lineA {
    height: 2px;
    width: 80vw;
    background-color: rgb(168, 61, 61);
    position: absolute;
    margin-top: -49px;
}
.result {
    background-color: rgb(30, 30, 30);
    margin: 5px auto 5px auto;
    height: 45px;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: move;
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
    font-size: 15px;
    cursor: pointer;
    display: none;
}
.oBtn:hover {
    color: white;
}
</style>