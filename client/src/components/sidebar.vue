<template>
    <div class="sidebar">
        <p id="logo" v-on:click="navigate('home')">TZMusic</p>
        <div class="menuItems">
            <ul>
                <li v-on:click="navigate('home')"><HomeIcon class="icons"/>Home</li>
                <li v-on:click="navigate('user?u=' + 'test')"><UserIcon class="icons"/>Profile</li>
                <li v-on:click="navigate('settings')"><SettingsIcon class="icons"/>Settings</li>
                <li v-on:click="navigate('list')"><ListIcon class="icons"/>List</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { HomeIcon, UserIcon, SettingsIcon, ListIcon } from 'vue-feather-icons';

export default {
    name: "sidebar",
    components: {
        HomeIcon, UserIcon, SettingsIcon, ListIcon
    },
    data() {
        return {
            
        }
    },
    methods: {
        navigate: function(route) {
            this.$router.push('/' + route);
        }
    }
}
</script>

<style scoped>
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