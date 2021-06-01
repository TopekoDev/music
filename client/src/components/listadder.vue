<template>
    <div id="listadder">
        <div id="laLists">
            <p id="laText">Add to...</p>
            <button id="laCancel" @click="close">X</button>
            <div class="laDivider" style="margin-top: 9px;"></div>
            <div id="laScroll">
                <button class="laList" v-for="(object,index) in lists" v-bind:key="index" @click="addVideo(lists[index]._id)">{{ lists[index].name }}</button>
            </div>
            <div class="laDivider"></div>
            <button class="laList" @click="newList">+ Create new list</button>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import axios from 'axios';
export default {
    name: "listadder",
    components: {

    },
    data() {
        return {
            lists: []
        }
    },
    methods: {
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
        addVideo: async function(theList) {
            let theVid = this.selectedVideo;
            if(theVid.id.videoId != "none" && theVid) {
                await axios(process.env.VUE_APP_SERVER_ADDRESS + '/addvideo', {
                    method: "post",
                    data: {list: theList, video: theVid},
                    withCredentials: true
                }).catch(function(err) {
                    console.log(err)
                });
            }
            this.close();
        },
        newList: async function() {
            let theVid = this.selectedVideo;
            if(theVid.id.videoId != "none" && theVid) {
                let listName = "My list #" + (this.lists.length + 1);
                const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/createlist', {
                    method: "post",
                    data: {name: listName, public: false},
                    withCredentials: true
                });
                console.log(response);
                this.addVideo(response.data.listId);
            }
        },
        close: function() {
            this.LIST_ADDER("");
        },
        ...mapMutations([
            'LIST_ADDER'
        ])
    },
    computed: {
        ...mapState([
            'listAdder',
            'selectedVideo'
        ])
    },
    watch: {
        listAdder: function() {
            if(this.listAdder === true) {
                document.getElementById("listadder").style.display = "block";
                this.getUserLists();
            } else {
                document.getElementById("listadder").style.display = "none";
            }
        }
    }
}
</script>

<style>
#listadder {
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
#laText {
    margin: 0 155px 0 0;
    padding: 10px 0 0 0;
    font-size: 17px;
}
#laCancel {
    position: fixed;
    padding: 10px 15px;
    cursor: pointer;
    margin: -30px 0 0 85px;
    background-color: transparent;
    border: none;
    color: grey;
    font-size: 15px;
}
#laCancel:hover {
    color: white;
}
#laScroll {
    overflow-y: scroll;
    max-height: 220px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
#laSroll::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
#laLists {
    background-color: rgb(30, 30, 30);
    width: 250px;
    padding: 0 0 0 0;
    height: auto;
    margin: auto;
}
.laList {
    background-color: rgb(30, 30, 30);
    border: none;
    padding: 10px 15px;
    width: 100%;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    text-align: left;
}
.laList:hover {
    background-color: rgb(27, 27, 27);
}
.laDivider {
    background-color: rgb(60, 60, 60);
    height: 1px;
}
</style>