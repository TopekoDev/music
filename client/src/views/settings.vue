<template>
    <div class="container">
        <h1>Settings</h1>
        <h2>YouTube API key (Required):</h2>
        <p style="color: grey; font-size: 13px;">The key will be stored locally in a cookie.</p>
        <input id="keyInput" v-model="apiKey" placeholder="Enter key.." type="text">
        <button id="keySubmit" v-on:click="submitKey">Submit</button>
        <p class="links"><a target="_blank" href="https://developers.google.com/youtube/v3/getting-started">Instructions</a></p>
        <input v-model="publicKey" v-on:click="publicKeyBox" type="checkbox" name="" id="pkc">
        <label for="pkc" style="color: white;">Use public key instead</label>
        <p style="color: grey; font-size: 13px;">The key has limited uses and might not always work!</p>
        <br>
        <div v-if="loggedIn">
            <h2>Privacy</h2>
            <button style="margin-top: 5px;" id="dataBtn" v-on:click="viewData">View your data</button>
            <br><br>
            <h2>Account</h2>
            <button id="logoutBtn" v-on:click="logout">Logout</button><br>
            <button style="margin-top: 5px;" id="removeAccBtn" v-on:click="removeAccount">Remove account and data</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "settings",
    data() {
        return {
            apiKey: "",
            publicKey: Boolean,
            loggedIn: false
        }
    },
    methods: {
        submitKey: function() {
            this.$cookie.set('api_key', this.apiKey, { expires: '2Y' });
        },
        publicKeyBox: function() {
            switch(this.$cookie.get('public_key')) {
                case "true":
                    this.$cookie.set('public_key', "false", { expires: '2Y' });
                    break;
                case "false": default:
                    this.$cookie.set('public_key', "true", { expires: '2Y' });
                    break;
            }
        },
        viewData: function() {
            window.location=process.env.VUE_APP_SERVER_ADDRESS + '/user';
        },
        logout: async function() {
            //logout the user
            await axios(process.env.VUE_APP_SERVER_ADDRESS + '/logout', {
                method: "get",
                withCredentials: true
            });
            this.$router.push('/');
        },
        removeAccount: async function() {
            //confirmation
            if(confirm("Delete Account and all data? Cannot be undone!")) {
                //logout first
                this.logout();
                //send account remove request
                await axios(process.env.VUE_APP_SERVER_ADDRESS + '/account', {
                    method: "post",
                    data: {type: 'remove'},
                    withCredentials: true
                });
            }
        }
    },
    mounted() {
        if(this.$cookie.get('loggedin') == "true") {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }

        if(this.$cookie.get('api_key')) {
            this.apiKey = this.$cookie.get('api_key');
        }
        switch(this.$cookie.get('public_key')) {
            case "true":
                this.publicKey = true;
                break;
            case "false": default:
                this.publicKey = false;
                break;
        }
    }
}
</script>

<style scoped>
.container {
    margin-left: 10vw;
    margin-right: 10vw;
    margin-top: 80px;
    margin-bottom: 110px;
}
#keyInput {
    background-color: rgb(25, 25, 25);
    font-size: 15px;
    border: none;
    color: white;
    height: 35px;
    width: 50%;
    max-width: 350px;
    flex: 1;
    padding: 0 5px 0 5px;
    border-radius: 2px;
}
#keySubmit {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
    margin-left: 5px;
}
#logoutBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
}
#dataBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
}
#removeAccBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color:white;
    border-radius: 2px;
    cursor: pointer;
    height: 35px;
}
.links a {
    color: rgb(38, 141, 189);
    font-size: 15px;
}
</style>