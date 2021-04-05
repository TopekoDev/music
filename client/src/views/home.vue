<template>
    <div class="container">
        <div v-if="!loggedIn" class="login">
            <h1 style="font-size: 30px;">Home</h1>
            <p>If you want to add songs to a playlist <a href="/login">Login</a> or <a href="/register">Create account</a>.</p>
        </div>
        <div v-if="loggedIn">
            <div id="banner">
                <h1>Home</h1>
            </div>
            <h1 style="font-size: 30px;">Your music</h1>
            <div class="line" style="width: 100%; margin-top: -10px;"></div>
            <h2 style="font-size: 18px;">Recently played</h2>
            <h2 style="font-size: 18px;">Lists</h2>
            <div id="listsGrid">
                <div class="list" @click="navigate('list?l=' + lists[index]._id)" v-for="(object,index) in lists" v-bind:key="index">
                    <ListIcon class="listIcon"/>
                    <p class="listName">{{ lists[index].name }}</p>
                </div>
                <div class="list" id="addlist" @click="createListDialog(true)">
                    <PlusIcon class="listIcon"/>
                    <p class="listName">New List</p>
                </div>
            </div>
            <h2 style="font-size: 18px;">Favourited lists</h2>
            <br>
            <h1 style="font-size: 30px;">Explore</h1>
            <div class="line" style="width: 100%; margin-top: -10px;"></div>
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
import { mapMutations } from 'vuex';
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
            listName: ""
        }
    },
    methods: {
        navigate: function(route) {
            this.$router.push('/' + route);
        },
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
                this.getUserLists();
            }
        },
        ...mapMutations([
            'SET_VIDEO'
        ])
    },
    mounted() {
        if(this.$cookie.get('loggedin') == "true") {
            this.loggedIn = true;
            this.getUserLists();
        } else {
            this.loggedIn = false;
        }
    }
}
</script>

<style scoped>
#banner {
    width: 100%;
    height: 100px;
    border-radius: 10px;
    background: rgb(26,21,79);
    background: linear-gradient(90deg, rgba(26,21,79,1) 0%, rgba(122,3,3,1) 43%, rgba(5,70,150,1) 100%);
}
#banner h1 {
    font-size: 40px;
    padding: 26px 0 0 50px;
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
}
#createList #cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-left: 12px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
}
#createList #field {
    background-color: rgb(25, 25, 25);
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
    border-radius: 10px;
}
#listsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-column-gap: 10px;
    grid-row-gap: 10px;
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
}
.list:hover {
    background-color: rgb(25, 25, 25);
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
.line {
    background-color: rgb(60, 60, 60);
    height: 1px;
}

.container {
    margin-left: 10vw;
    margin-right: 10vw;
    margin-top: 80px;
    margin-bottom: 110px;
}
</style>