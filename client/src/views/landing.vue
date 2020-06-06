<template>
    <div class="container">
        <div class="centered">
            <div class="header">
                <h1>TZMusic</h1>
                <p>Opensource YouTube powered music player.</p>
            </div>
            <div class="buttons">
                <button v-on:click="login">Login</button><br>
                <button v-on:click="register">Create account</button><br>
                <button id="noaccBtn" v-on:click="home">Use without account</button><br>
            </div>
            <div class="links">
                <a href="https://github.com/Topekz/tzmusic">GitHub repository</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "landing",
    methods: {
        register: function() {
            this.$router.push('/register');
        },
        login: function() {
            this.$router.push('/login');
        },
        home: function() {
            this.$router.push('/home');
        }
    },
    created() {
        if(this.$cookie.get('loggedin')=="true") {
            this.$router.push('/home');
        }
    }
}
</script>

<style scoped>
.container {
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
.centered {
    display: table-cell;
    vertical-align: middle;
}
.header {
    text-align: center;
}
.header h1 {
    font-size: 40px;
}
.buttons {
    text-align: center;
    margin-top: 40px;
}
.buttons button {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    margin: 0 auto 10px auto;
    padding: 10px 30px 10px 30px;
    color: white;
    width: 200px;
}
#noaccBtn {
    background-color: transparent;
    border: 2px solid rgb(139, 139, 139);
    color: rgb(209, 209, 209);
}
button:hover {
    cursor: pointer;
}
.links {
    text-align: center;
    margin-top: 50px;
}
.links a {
    color: rgb(38, 141, 189);
    font-size: 15px;
}
</style>