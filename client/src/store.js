import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import cookies from 'vue-cookie';

Vue.use(Vuex);

//vuex store
export default new Vuex.Store({
    state: {
        ytInfo: {"kind":"none","etag":"none","id":{"kind":"none","videoId":"none"},"snippet":{"publishedAt":"none","channelId":"none","title":"Nothing is playing","description":"none","thumbnails":{"default":{"url":"none","width":"none","height":"none"},"medium":{"url":"none","width":"none","height":"none"},"high":{"url":"none","width":"none","height":"none"}},"channelTitle":"none","liveBroadcastContent":"none"}}
    },
    getters: {
        
    },
    mutations: {
        SET_VIDEO: (state, video) => {
            state.ytInfo = video;
        }
    },
    actions: {
        
    }
});