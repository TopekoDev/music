<template>
    <div class="container">
        <div v-if="!loggedIn" class="login">
            <p>If you want to add songs to a playlist <a href="/login">Login</a> or <a href="/register">Create account</a>.</p>
            <p>You can search and play music normally without an account :)</p>
        </div>
        <div v-if="loggedIn">
            <p>Your lists:</p>
            <div class="lists">
                <div class="list" v-on:click="navigate('list?l=' + lists[index].id)" v-for="(object,index) in lists" v-bind:key="index">
                    <p>{{ lists[index].name }}</p>
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
            lists: []
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
        navigate: function(route) {
            this.$router.push('/' + route);
        },
        ...mapMutations([
            'SET_VIDEO'
        ])
    },
    mounted() {
        if(this.$cookie.get('loggedin')=="true") {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
        this.getLists();
    }
}
</script>

<style scoped>
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
}
.list p {
    text-align: center;
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