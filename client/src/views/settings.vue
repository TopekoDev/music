<template>
    <div class="container">
        <h1>Settings</h1>
        <p>YouTube API key (Required):</p>
        <p style="color: grey; font-size: 13px;">The key will be stored locally in a cookie.</p>
        <input id="keyInput" v-model="apiKey" placeholder="Enter key.." type="text">
        <button id="keySubmit" v-on:click="submitKey">Submit</button>
        <p class="links"><a target="_blank" href="https://developers.google.com/youtube/v3/getting-started">Instructions</a></p>
        <input v-model="publicKey" v-on:click="publicKeyBox" type="checkbox" name="" id="pkc">
        <label for="pkc" style="color: white;">Use our API key instead</label>
        <p style="color: grey; font-size: 13px;">The key has limited uses and might not always work!</p>
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
            apiKey: "",
            publicKey: Boolean
        }
    },
    methods: {
        submitKey: function() {
            this.$cookie.set('api_key', this.apiKey, { expires: '2Y' });
        },
        publicKeyBox: function() {
            if(this.$cookie.get('public_key')) {
                this.$cookie.delete('public_key');
            } else {
                this.$cookie.set('public_key', "true", { expires: '2Y' });
            }
            if(this.$cookie.get('public_key')) {
                this.publicKey = true;
            } else {
                this.publicKey = false;
            }
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
        if(this.$cookie.get('public_key')) {
            this.publicKey = true;
        } else {
            this.publicKey = false;
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