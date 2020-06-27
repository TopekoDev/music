<template>
    <div class="container">
        <div v-if="!loggedIn" class="login">
            <p>If you want to add songs to a playlist <a href="/login">Login</a> or <a href="/register">Create account</a>.</p>
            <p>You can still play music without an account :)</p>
        </div>
        <div v-if="loggedIn">
            <p>Your lists:</p>
            <div class="lists">
                <div class="list" v-on:click="navigate('list?l=' + lists[index].id)" v-for="(object,index) in lists" v-bind:key="index">
                    <p>{{ lists[index].name }}</p>
                </div>
                <div class="list" id="addlist" v-on:click="listCreator = true">
                    <p>+ New List</p>
                </div>
            </div>
        </div>
        <div class="newList" v-if="listCreator">
            <div id="createListBG">
                <div class="createList">
                    <input id="field" class="inField" v-on:keyup.enter="createList" autocomplete="off" name="name" type="text" placeholder="Enter list name..." v-model="listName" />
                    <br/><br>
                    <button id="create" v-on:click="createList">Create</button>
                    <button id="cancel" v-on:click="listCreator=false; listName=''">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
    name: "home",
    components: {
        
    },
    data() {
        return {
            loggedIn: false,
            lists: [],
            listCreator: false
        }
    },
    methods: {
        getLists: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.lists = theUser.data[0].lists;
            this.lists.sort(function(a, b) { 
                return a.name > b.name ? 1 : -1;
            });
        },
        navigate: function(route) {
            this.$router.push('/' + route);
        },
        createList: async function() {
            if(this.listName.length > 0) {
                    const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/add', {
                    method: "post",
                    data: {type: 'list', list: this.listName},
                    withCredentials: true
                });
                console.log(response);
                this.getLists();
                this.listCreator = false;
                this.listName = "";
            }
        },
        ...mapMutations([
            'SET_VIDEO'
        ])
    },
    mounted() {
        if(this.$cookie.get('loggedin') == "true") {
            this.loggedIn = true;
            this.getLists();
        } else {
            this.loggedIn = false;
        }
    }
}
</script>

<style scoped>
.newList {
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
.newList #create {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: white;
    cursor: pointer;
    margin-right: 12px;
}
.newList #cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-left: 12px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
}
.newList #field {
    background-color:rgb(30, 30, 30);
    font-size: 15px;
    border: none;
    color: rgb(212, 212, 212);
    height: 35px;
    width: 225px;
    flex: 1;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}
.newList #createListBG {
    background-color: rgb(30, 30, 30);
    width: 300px;
    height: auto;
    padding: 20px;
    margin: auto;
    border-radius: 10px;
}

.lists {
    display: flex;
    flex-wrap: wrap;
}
.list {
    width: 200px;
    height: 200px;
    background-color: rgb(30, 30, 30);
    margin: 0 10px 20px 10px;
    display: flex;
    align-items: center; /* Vertical center alignment */
    justify-content: center;
    cursor: pointer;
}
.list:hover {
    background-color: rgb(25, 25, 25);
}
.list p {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px 0 10px;
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
</style>