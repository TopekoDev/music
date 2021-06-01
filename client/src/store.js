import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//vuex store
export default new Vuex.Store({
    state: {
        ytInfo: {"kind":"none","etag":"none","id":{"kind":"none","videoId":"none"},"snippet":{"publishedAt":"none","channelId":"none","title":"Nothing is playing","description":"none","thumbnails":{"default":{"url":"none","width":"none","height":"none"},"medium":{"url":"none","width":"none","height":"none"},"high":{"url":"none","width":"none","height":"none"}},"channelTitle":"none","liveBroadcastContent":"none"}},
        queue: [],
        history: [],
        list: "",
        shuffle: false,
        shuffledList: [],
        selectedVideo: "",
        listAdder: false //this is really stupid but couldn't find any other way to trigger same component from anywhere
    },
    getters: {
        
    },
    mutations: {
        SET_VIDEO: (state, video) => {
            state.queue = [];
            state.history = [];
            state.ytInfo = video;
        },
        CLEAR_VIDEO: (state) => {
            state.ytInfo = {"kind":"none","etag":"none","id":{"kind":"none","videoId":"none"},"snippet":{"publishedAt":"none","channelId":"none","title":"Nothing is playing","description":"none","thumbnails":{"default":{"url":"none","width":"none","height":"none"},"medium":{"url":"none","width":"none","height":"none"},"high":{"url":"none","width":"none","height":"none"}},"channelTitle":"none","liveBroadcastContent":"none"}};
            state.queue = [];
            state.history = [];
            state.list = "";
            state.shuffledList = [];
        },
        NEXT_VIDEO: (state) => {
            state.history.push(state.ytInfo);
            state.ytInfo = state.queue[state.queue.length-1];
            state.queue.splice(state.queue.length-1,1);
        },
        PREVIOUS_VIDEO: (state) => {
            state.queue.push(state.ytInfo);
            state.ytInfo = state.history[state.history.length-1];
            state.history.splice(state.history.length-1,1);
        },
        QUEUE_VIDEO: (state, video) => {
            state.queue.push(video);
        },
        HISTORY_VIDEO: (state, video) => {
            state.history.push(video);
        },
        SET_LIST: (state, id) => {
            state.list = id;
        },
        SET_SHUFFLE: (state, bool) => {
            state.shuffle = bool
        },
        SET_SHUFFLE_LIST: (state, songs) => {
            state.shuffledList = songs;
        },
        LIST_ADDER: (state, video) => {
            //stupid ik...
            if(state.listAdder === true) {
                state.listAdder = false;
            } else {
                state.selectedVideo = video;
                state.listAdder = true;
            }
        }
    },
    actions: {

    }
});