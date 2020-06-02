<template>
    <div>
        <div class="sidebar">
            <p id="logo" v-on:click="navigate('home')">TZMusic</p>
            <div class="menuItems">
                <ul>
                    <li v-on:click="navigate('home')"><HomeIcon class="icons"/>Home</li>
                    <!-- <li v-on:click="navigate('user?u=' + 'test')"><UserIcon class="icons"/>Profile</li> -->
                    <li v-on:click="navigate('settings')"><SettingsIcon class="icons"/>Settings</li>
                    <br>
                    <div class="listItems">
                        <li v-on:click="navigate('list?l=' + lists[index].id)" v-for="(object,index) in lists" v-bind:key="index" ><ListIcon class="lists"/><p class="listsTxt">{{ lists[index].name }}</p></li>
                        <li v-on:click="listCreator = true"><PlusIcon class="icons"/>New List</li>
                    </div>
                </ul>
            </div>
        </div>
        <div class="newList" v-if="listCreator">
            <div class="createList">
                <input id="field" class="inField" v-on:keyup.enter="createList" autocomplete="off" name="name" type="text" placeholder="List name" v-model="listName" />
                <br/><br>
                <button id="create" v-on:click="createList">Create</button>
                <button id="cancel" v-on:click="listCreator=false; listName=''">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import { HomeIcon, /*UserIcon,*/ SettingsIcon, ListIcon, PlusIcon } from 'vue-feather-icons';
import axios from 'axios';

export default {
    name: "sidebar",
    components: {
        HomeIcon, /*UserIcon,*/ SettingsIcon, ListIcon, PlusIcon
    },
    data() {
        return {
            lists: [],
            listName: "",
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
        navigate: function(route) {
            this.$router.push('/' + route);
        }
    },
    watch: {
        $route() {
            this.getLists();
        }
    },
    mounted() {
        this.getLists();
    }
}
</script>

<style scoped>
.newList {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
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
    background-color: rgb(139, 139, 139);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    color: rgb(20, 20, 20);
    cursor: pointer;
    margin-left: 12px;
}
.newList #field {
    background-color:rgb(255, 255, 255);
    font-size: 15px;
    border: none;
    color: rgb(0, 0, 0);
    height: 35px;
    width: 225px;
    flex: 1;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}

.sidebar {
    background-color: rgba(30, 30, 30);
    width: 180px;
    position: fixed;
    top: 0;
    height: 100%;
    margin: 0;
    padding: 0;
}
#logo {
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}
.menuItems {
    padding: 0;
}
.menuItems ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
.menuItems .icons {
    height: 25px;
    width: 25px;
    vertical-align: middle;
    margin: 0 10px 2px 20px;
}
.menuItems .lists {
    height: 25px;
    width: 25px;
    vertical-align: middle;
    margin: 0 10px 0 20px;
    display: inline-block;
}
.menuItems .listsTxt {
    width: 110px;
    margin: 0 0 -5px 0;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.menuItems li {
    color: white;
    padding: 10px 0 10px 0;
    cursor: pointer;
    font-size: 16px;
}
.menuItems li:hover {
    background-color: rgba(255, 255, 255, 0.01);
}
@media (max-width: 860px) {
    .listItems {
        display: none;
    }
    .menuItems li {
        font-size: 0;
    }
    .sidebar {
        width: 65px;
        padding-top: 64px;
    }
    #logo {
        font-size: 0;
    }
}
</style>