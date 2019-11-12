<template>
    <div class="container">
        <h1>Settings</h1>
        <p>YouTube API key (*Needed):</p>
        <p style="color: grey; font-size: 13px;">The key will be stored locally as a cookie.</p>
        <input id="keyInput" v-model="apiKey" placeholder="Enter key.." type="text">
        <button id="keySubmit" v-on:click="submitKey">Submit</button>
        <p class="links"><a target="_blank" href="https://developers.google.com/youtube/v3/getting-started">Instructions</a></p>
        <br>
        <p>Logout of your account</p>
        <button id="logoutBtn" v-on:click="logout">Logout</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "settings",
    data() {
        return {
            apiKey: ""
        }
    },
    methods: {
        submitKey: function() {
            this.$cookie.set("api_key", this.apiKey, { expires: '2Y' });
        },
        logout: async function() {
            //logout the user
            await axios(process.env.VUE_APP_SERVER_ADDRESS + '/logout', {
                method: "get",
                withCredentials: true
            });
            this.$router.push('/');
        }
    },
    mounted() {
        if(this.$cookie.get('api_key')) {
            this.apiKey = this.$cookie.get('api_key');
        }
    }
}
</script>

<style scoped>
.container {
    /* +180px from left is the sidebar width and top margin is the navbar*/
    margin-left: 200px;
    margin-top: 80px;
}
#keyInput {
    background-color:rgb(255, 255, 255);
    font-size: 15px;
    border: none;
    color: rgb(0, 0, 0);
    height: 35px;
    width: 350px;
    flex: 1;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}
#keySubmit {
    background-color: rgb(255, 255, 255);
    border: none;
    color: rgb(0, 0, 0);
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
    margin-left: 5px;
}
#logoutBtn {
    background-color: rgb(255, 255, 255);
    border: none;
    color: rgb(0, 0, 0);
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
}
.links a {
    color: rgb(38, 141, 189);
    font-size: 15px;
}
@media (max-width: 860px) {
    .container {
        margin-top: 75px;
        margin-left: 75px;
    }
}
</style>