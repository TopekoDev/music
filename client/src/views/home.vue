<template>
    <div class="container">
        <div v-if="!loggedIn" class="innerContainer">
            <h1 style="font-size: 30px;">Demo Mode</h1>
            <p>In order to unlock all features <a href="/login">Log in</a> or <a href="/register">Create account</a>.</p>
        </div>
        <div v-if="loggedIn" class="innerContainer">
            <h1 style="font-size: 30px;">Your Music</h1>
            <div class="line" style="width: 100%; margin-top: -10px;"></div>
            <h2 style="font-size: 18px;">Recently Played</h2>
            <p style="margin: 0; padding: 0; color: grey;" v-if="recent.length < 1">Music you've recently played will be shown here!</p>
            <div id="recentGrid">
                <div class="recent" @click="setVideo(recent[index].video)" v-for="(object,index) in recent" v-bind:key="index">
                    <div class="image" v-bind:style="{ backgroundImage: `url(${recent[index].video.snippet.thumbnails.medium.url})` }">
                        <div class="overlay"></div>
                        <p class="title">{{ recent[index].video.snippet.title }}</p>
                    </div>
                </div>
            </div>
            <h2 style="font-size: 18px;">Your Lists</h2>
            <div class="listsGrid">
                <div class="list" @click="navigate('list?l=' + lists[index]._id)" v-for="(object,index) in lists" v-bind:key="index">
                    <ListIcon class="listIcon"/>
                    <p class="listName">{{ lists[index].name }}</p>
                </div>
                <div class="list" id="addlist" @click="createListDialog(true)">
                    <PlusIcon class="listIcon"/>
                    <p class="listName">New List</p>
                </div>
            </div>
            <h1 style="font-size: 30px;">Discover</h1>
            <div class="line" style="width: 100%; margin-top: -10px;"></div>
            <h2 style="font-size: 18px;">Made for You</h2>
            <div class="cardGrid">
                <div id="personalTop" @click="navigate('personaltop')" v-if="this.recent.length > 0">
                    <h2>Your Top<br>Songs</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#c96056" fill-opacity="1" d="M0,32L60,64C120,96,240,160,360,186.7C480,213,600,203,720,176C840,149,960,107,1080,80C1200,53,1320,43,1380,37.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
                </div>
                <div id="personalRecommendations" @click="navigate('recommended')" v-if="this.recent.length > 0">
                    <h2>You<br>Might Like</h2>
                </div>
                <div id="trending" @click="navigate('trending')">
                    <h2>Trending<br>In Your Region</h2>
                </div>
            </div>
        </div>
        <div id="createList">
            <div id="createListBG">
                <div>
                    <input id="field" class="inField" v-on:keyup.enter="createList" autocomplete="off" name="name" type="text" placeholder="Enter list name..." v-model="listName" />
                    <br/><br>
                    <button id="create" @click="createList">Create</button>
                    <button id="cancel" @click="createListDialog(false)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import { ListIcon, PlusIcon } from 'vue-feather-icons';

export default {
    name: "home",
    components: {
        ListIcon, PlusIcon
    },
    data() {
        return {
            loggedIn: false,
            lists: [],
            listName: "",
            recent: []
        }
    },
    methods: {
        navigate: function(route) {
            this.$router.push('/' + route);
        },
        getLists: async function() {
            const theLists = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/userlists', {
                method: "get",
                withCredentials: true
            });
            this.lists = theLists.data;
            this.lists.sort(function(a, b) { 
                return a.name > b.name ? 1 : -1;
            });
        },
        getUser: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.recent = theUser.data[0].recent;
            this.recent.reverse();
        },
        createListDialog: function(state) {
            let element = document.getElementById("createList");
            this.listName = "";
            if(state) {
                element.style.display = "block";
                document.getElementById("field").focus();
            } else {
                element.style.display = "none";
            }
        },
        createList: async function() {
            if(this.listName.length > 0) {
                const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/createlist', {
                    method: "post",
                    data: {name: this.listName, public: false},
                    withCredentials: true
                });
                console.log(response);
                this.createListDialog(false);
                this.getLists();
            }
        },
        setVideo: function(video) {
            if(this.shuffle) {
                this.CLEAR_VIDEO();
                this.SET_SHUFFLE(false);
            }
            this.SET_LIST("");
            this.SET_VIDEO(video);
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
        if(this.$cookie.get('loggedin') == "true") {
            this.loggedIn = true;
            this.getLists();
            this.getUser();
        } else {
            this.loggedIn = false;
        }
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
    min-width: 800px;
}
#recentGrid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    min-width: 800px;
}
.recent {
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
}
.recent .image {
    width: auto;
    height: 10vw;
    min-height: 100px;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
}
.recent .overlay {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0, 0, 0, 0) 40%, rgba(0,0,0,0.4) 100%);
}
.recent:hover .overlay {
    background: rgba(0,0,0,0.4);
}
.recent .title {
    position: absolute;
    bottom: -5px;
    padding: 0 10px;
    left: 0;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
}
#createList {
    display: none;
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
#createList #create {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: white;
    cursor: pointer;
    margin-right: 12px;
    font-size: 15px;
}
#createList #cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-left: 12px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
    font-size: 15px;
}
#createList #field {
    background-color: rgb(20, 20, 20);
    font-size: 15px;
    border: none;
    color: rgb(212, 212, 212);
    height: 35px;
    width: 225px;
    flex: 1;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}
#createList #createListBG {
    background-color: rgb(25, 25, 25);
    width: 300px;
    height: auto;
    padding: 20px;
    margin: auto;
    border-radius: 5px;
}
.listsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    min-width: 800px;
}
.list {
    background-color: rgb(30, 30, 30);
    margin: 5px auto 5px auto;
    height: 60px;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: pointer;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.4));
}
.list:hover {
    background-color: rgb(27, 27, 27);
}
.listIcon {
    color: white;
    margin: 0 0 0 15px;
    position: absolute;
}
.listName {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px 0 50px;
}
.cardGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(242.5px, 1fr));
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    min-width: 800px;
    margin-bottom: 30px;
}
.cardGrid div {
    transition: all .1s;
}
.cardGrid > div:hover {
    transform: scale(1.02);
}
#personalTop {
    height: 20vw;
    min-height: 200px;
    border-radius: 5px;
    background: rgb(201,96,86);
    background: linear-gradient(0deg, rgba(201,96,86,1) 0%, rgba(201,96,80,1) 22%, rgba(179,60,60,1) 22%, rgba(162,53,42,1) 100%);
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
}
#personalTop h2 {
    padding: 20px;
    margin: 0;
    font-size: max(22px, 2.2vw);
    
}
#personalTop svg {
    position: absolute;
    bottom: max(35px, 3.5vw);
    left: 0;
}
#personalRecommendations {
    height: 20vw;
    min-height: 200px;
    border-radius: 5px;
    background: rgb(87,37,177);
    background: linear-gradient(0deg, rgba(87,37,177,1) 26%, rgba(24,117,179,1) 100%);
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
}
#personalRecommendations h2 {
    padding: 20px;
    margin: 0;
    font-size: max(22px, 2.2vw);
    
}
#trending {
    height: 20vw;
    min-height: 200px;
    border-radius: 5px;
    background: rgb(177,101,37);
    background: linear-gradient(0deg, rgba(177,101,37,1) 34%, rgba(179,127,24,1) 100%); 
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
}
#trending h2 {
    padding: 20px;
    margin: 0;
    font-size: max(22px, 2.2vw);
    
}
.line {
    background-color: rgb(60, 60, 60);
    height: 1px;
}
</style>