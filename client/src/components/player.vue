<template>
    <div>
        <div id="MOBILEDETECTED" v-if="mobile">
            <p>This website was not designed for mobile!</p>
            <button v-on:click="mobile = false">I don't care :)</button>
        </div>
        <div id="player">
            <div class="info">
                <youtube style="position: relative; bottom: 0; width: 179px; height: 100px; float: left; margin: 0 0 0 0; pointer-events: none;" id="ytPlayer" width=100% height=100% v-bind:video-id="ytInfo.id.videoId" v-bind:player-vars="playerVars" v-on:cued="cued" v-on:playing="playing" v-on:paused="paused" v-on:ended="ended" ref="youtube"></youtube>
                <ArrowUpRightIcon id="expandIcon" v-on:click="expand"/>
                <ArrowDownLeftIcon v-if="expanded" id="minimizeIcon" v-on:click="minimize"/>
                <p id="title" style="padding-left: 10px">{{ ytInfo.snippet.title }}</p>
                <YoutubeIcon style="padding-right: 10px; margin-left: 10px;" class="infoBtn" v-on:click="openYt"/>
            </div>
            <div class="controls">
                <PlusIcon class="ctrlIcon" id="add" v-on:click="addToList(ytInfo)"/>
                <SkipBackIcon class="ctrlIcon" id="back" v-on:click="skipBack"/>
                <PlayCircleIcon class="ctrlIcon" style="padding: 0 13px 0 13px" id="play" v-if="!isPlaying" v-on:click="playVideo"/>
                <PauseCircleIcon class="ctrlIcon" style="padding: 0 13px 0 13px" id="pause" v-if="isPlaying" v-on:click="pauseVideo"/>
                <SkipForwardIcon class="ctrlIcon" id="forward" v-on:click="skip"/>
                <RepeatIcon v-if="!onRepeat" class="ctrlIcon" id="repeat" v-on:click="repeat"/>
                <RepeatIcon v-if="onRepeat" class="ctrlIcon" id="repeatO" v-on:click="repeat"/>
                <div v-on:click="barSeek" id="seekbar">
                    <p class="progress">{{ Math.round(Math.floor(this.progress / 60))+':'+('0'+Math.round(this.progress-(Math.floor(this.progress / 60)*60))).slice(-2) }}</p>
                    <p class="duration">{{ Math.round(Math.floor(this.duration / 60))+':'+('0'+Math.round(this.duration-(Math.floor(this.duration / 60)*60))).slice(-2) }}</p>
                    <div v-if="!isCued" id="bar-bg"></div>
                    <div v-if="!isCued" :style="{ width: (progress/duration)*100 + '%' }" id="progress-bar"></div>
                    <div v-if="isCued" id="placeholder-bar"></div>
                </div>
            </div>
            <div class="modifiers">
                <VolumeXIcon style="margin-right: 3px;" v-if="muted" v-on:click="unMute" id="volumeIcon"/>
                <Volume1Icon v-if="!muted" v-on:click="mute" id="volumeIcon"/>
                <input v-model="volume" type="range" name="volume" id="volume">
            </div>
        </div>

        <div class="listAdd" v-if="listAdder">
            <div id="listAddBG">
                <p style="margin: 0 0 10px 0; padding: 0;">Add to list</p>
                <div class="innerlist">
                    <div v-for="(object,index) in lists" v-bind:key="index">
                    <button id="list" v-on:click="addVideo(selectedVideo, lists[index].id)">{{ lists[index].name }}</button>
                    </div>
                    <br>
                </div>
                <button id="cancel" v-on:click="listAdder=false">Cancel</button>
            </div>
        </div>

    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { PlayCircleIcon, PauseCircleIcon, SkipBackIcon, SkipForwardIcon, Volume1Icon, VolumeXIcon, YoutubeIcon, PlusIcon, RepeatIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from 'vue-feather-icons';
import axios from 'axios';

export default {
    name: "player",
    components: {
        PlayCircleIcon, PauseCircleIcon, SkipBackIcon, SkipForwardIcon, Volume1Icon, VolumeXIcon, YoutubeIcon, PlusIcon, RepeatIcon, ArrowUpRightIcon, ArrowDownLeftIcon
    },
    data() {
        return {
            playerVars: {
                enablejsapi: 1,
                autoplay: 0,
                controls: 1,
                disablekb: 1,
                fs: 0,
                modestbranding: 1
            },
            progress: 0,
            duration: 0.1,
            volume: 50,
            onRepeat: false,
            isPlaying: false,
            isCued: false,
            listAdder: false,
            selectedVideo: "",
            lists: [],
            mobile: false,
            muted: false,
            expanded: false,
            warning: false
        }
    },
    methods: {
        addToList: function(video) {
            this.getLists();
            this.listAdder = true;
            this.selectedVideo = video;
        },
        getLists: async function() {
            const theUser = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/user', {
                method: "get",
                withCredentials: true
            });
            this.lists = theUser.data[0].lists;
        },
        addVideo: async function(video, theList) {
            let theVid = video;
            const response = await axios(process.env.VUE_APP_SERVER_ADDRESS + '/add', {
                method: "post",
                data: {type: 'video' ,list: theList, video: theVid},
                withCredentials: true
            });
            this.listAdder = false;
            this.selectedVideo = "";
            console.log(response);
        },
        playVideo: function() {
            if(this.ytInfo.id.videoId != 'none') {
                this.$refs.youtube.player.playVideo();
            }
        },
        pauseVideo: function() {
            if(this.ytInfo.id.videoId != 'none') {
                this.$refs.youtube.player.pauseVideo();
            }
        },
        updateVideo: async function() {
            // I Don't think there's a better way...
            if(this.ytInfo.id.videoId != 'none') {
                this.progress = await this.$refs.youtube.player.getCurrentTime();
                this.duration = await this.$refs.youtube.player.getDuration();
                this.$refs.youtube.player.setVolume(this.volume);
                if(this.muted) {this.$refs.youtube.player.mute();} else {this.$refs.youtube.player.unMute()}
            }
        },
        seekVideo: function(amount) {
            this.$refs.youtube.player.seekTo(amount);
        },
        playing: async function() {
            this.isCued = false;
            this.isPlaying = true;
            if(!this.warning) {
                let quality = await this.$refs.youtube.player.getPlaybackQuality();
                switch (quality) {
                    case "hd720": case "hd1080": case "highres":
                        console.log(quality);
                        alert("Quality lower than 720p is recommended.\nIt can be changed by expanding the video in the bottom left corner.\nPress 'OK' to not see this again.");
                        this.warning = true;
                        break;
                }
            }
        },
        paused: function() {
            this.isPlaying = false;
        },
        ended: function() {
            this.isPlaying = false;
            if(this.onRepeat) {
                this.playVideo();
            } else {
                if(this.queue.length > 0) {
                    if(this.queue[0].id.videoId == this.ytInfo.id.videoId) {
                        this.seekVideo(0);
                        this.playVideo();
                    }
                    this.NEXT_VIDEO();
                } else {
                    if(this.shuffle) {
                        this.SET_SHUFFLE_LIST(this.shuffledList.slice().sort(() => Math.random() - 0.5));
                        this.SET_VIDEO(this.shuffledList[0].video);
                        for(let i = this.shuffledList.length-1; i > 0; i--) {
                            this.QUEUE_VIDEO(this.shuffledList[i].video);
                        }
                        this.playVideo();
                    } else {
                        if(this.history.length >= 0) {
                            this.CLEAR_VIDEO();
                        } else {
                            this.pauseVideo();
                            this.seekVideo(0);
                        }
                    }
                }
            }  
        },
        cued: function() {
            this.isCued = true;
            this.playVideo();
        },
        barSeek: function(event) {
            if(window.innerWidth <= '500' && document.getElementById('mobileExpanded').style.bottom == '0px') {
                this.seekVideo(((event.offsetX)/(document.getElementById('mobileSeekbar').offsetWidth))*this.duration);
            } else if(window.innerWidth > '500') {
                this.seekVideo(((event.offsetX)/(document.getElementById('seekbar').offsetWidth))*this.duration);
            }
        },
        repeat: function() {
            if(!this.onRepeat) {
                this.onRepeat = true;
            } else {
                this.onRepeat = false;
            }
        },
        skip: function() {
            this.seekVideo(this.duration);
        },
        mute: function() {
            this.muted = true;
        },
        unMute: function() {
            if(this.volume > 0) {
                this.muted = false;
            }
        },
        skipBack: function() {
            if(this.history.length > 0) {
                if(this.progress >= 5) {
                    this.seekVideo(0);
                } else {
                    this.PREVIOUS_VIDEO();
                }
            } else {
                this.seekVideo(0);
            }
        },
        openYt: function() {
            window.open("https://youtube.com/watch?v=" + this.ytInfo.id.videoId, "_blank");   
        },
        expand: function() {
            // some disable scrolling thing I found idk..
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.onscroll = function() { window.scrollTo(scrollTop) }
            document.body.style.overflowY = "hidden";

            this.expanded = true;
            var ytPlayer = document.getElementById("ytPlayer");
            ytPlayer.style.position = "absolute";
            ytPlayer.style.pointerEvents = "auto";
            ytPlayer.style.bottom = "90px";
            ytPlayer.style.width = "100%";
            ytPlayer.style.height = "100vh";
        },
        minimize: function() {
            window.onscroll = function() {}; 
            document.body.style.overflowY = "auto";

            this.expanded = false;
            var ytPlayer = document.getElementById("ytPlayer");
            ytPlayer.style.position = "relative";
            ytPlayer.style.pointerEvents = "none";
            ytPlayer.style.width = "179px";
            ytPlayer.style.height = "100px";
            ytPlayer.style.bottom = "0";
        },
        ...mapMutations([
            'SET_VIDEO',
            'SET_LIST',
            'NEXT_VIDEO',
            'QUEUE_VIDEO',
            'PREVIOUS_VIDEO',
            'CLEAR_VIDEO',
            'SET_SHUFFLE',
            'SET_SHUFFLE_LIST'
        ])
    },
    computed: {
        ...mapState([
            'ytInfo',
            'queue',
            'history',
            'shuffle',
            'shuffledList'
        ])
    },
    mounted() {
        setInterval(this.updateVideo,250);
        if(this.$cookie.get('volume')) {
            this.volume = this.$cookie.get('volume');
        }
        // Some mobile test I found
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            console.log("Detected mobile device!");
            this.mobile = true;
        }
    },
    watch: {
        volume() {
            this.$cookie.set('volume', this.volume, { expires: '2Y' });
            if(this.volume == 0) {this.mute()}
            if(this.volume > 0 && this.muted) {this.unMute()}
        }
    }
}
</script>

<style scoped>
/* This is a mess.. */

#MOBILEDETECTED {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    padding-top: 30vh;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
}
#MOBILEDETECTED button {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    width: 200px;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 10px 0 0 5px;
}

.listAdd {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    padding-top: 30vh;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
}
.innerlist {
    overflow-y: scroll;
    max-height: 220px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.innerlist::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
#listAddBG {
    background-color: rgb(25, 25, 25);
    width: 300px;
    height: auto;
    padding: 20px;
    margin: auto;
    border-radius: 10px;
}
#list {
    background-color: rgb(168, 61, 61);
    border: none;
    border-radius: 10px;
    padding: 10px 30px 10px 30px;
    width: 200px;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 10px 0 0 5px;
}
#cancel {
    padding: 10px 30px 10px 30px;
    cursor: pointer;
    margin-top: 10px;
    background-color: rgb(25, 25, 25);
    border: none;
    border-radius: 10px;
    color: rgb(139, 139, 139);
}

#expandIcon {
    color: white;
    position: absolute;
    margin-left: -25px;
    width: 25px;
    height: 25px;
    z-index: 6;
    cursor: pointer;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.8));
}
#minimizeIcon {
    color: white;
    position: fixed;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    z-index: 6;
    cursor: pointer;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.8));
}

#player {
    position: fixed;
    bottom: 0;
    background-color: rgb(25, 25, 25);
    width: 100%;
    padding: 0 0 0 0;
    height: 90px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.4);
    user-select: text;
    z-index: 2;
}
.img {
    width: 100px;
    float: left;
    margin: 20px 10px 0 0;
    display: block;
}
.info {
    width: 550px;
    min-width: 300px;
    text-align: left;
    padding: 0 0 0 0;
}
#title {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 0 0 0;
    line-height: 1.2;
}
.infoBtn {
    color: rgb(212, 212, 212);
    width: 24px;
    height: 24px;
}
.infoBtn:hover {
    cursor: pointer;
    color: rgb(168, 61, 61);
}
.controls {
    background-color: none;
    width: 650px;
    min-width: 300px;
    text-align: center;
    padding: 13px 5px 0 20px;
}
#play, #pause {
    width: 37px;
    height: 37px;
    color: rgb(226, 226, 226);
    cursor: pointer;
}
#back, #forward {
    width: 28px;
    height: 28px;
    color: rgb(204, 204, 204);
    cursor: pointer;
    position: relative;
    bottom: 4px;
}
#add, #repeat, #repeatO {
    width: 20px;
    height: 20px;
    color: rgb(204, 204, 204);
    cursor: pointer;
    position: relative;
    bottom: 8px;
    padding: 0 20px 0 20px;
}
#repeatO {
    color: rgb(168, 61, 61);
}
#progress-bar {
    background-color: rgb(212, 212, 212);
    height: 7px;
    position: relative;
    top: -7px;
    border-radius: 10px;
}
#bar-bg {
    width: 100%;
    height: 7px;
    background-color: rgb(50, 50, 50);
    border-radius: 10px;
}
#seekbar:hover #progress-bar {
    background-color: white;
}
#seekbar:hover #bar-bg {
    background-color: rgb(55, 55, 55);
}
#seekbar {
    height: 7px;
    padding: 5px 0 8px 0;
    margin-top: 8px;
    cursor: pointer;
}
#placeholder-bar {
    width: 100%;
    height: 7px;
    background-color: rgb(60, 60, 60);
    border-radius: 10px;
    cursor: progress;
}
.progress {
    padding: 0;
    margin: 0;
    float: left;
    font-size: 10px;
    color: rgb(218, 218, 218);
    position: relative;
    bottom: 15px;
}
.duration {
    padding: 0;
    margin: 0;
    float: right;
    font-size: 10px;
    color: rgb(218, 218, 218);
    position: relative;
    bottom: 15px
}
.modifiers {
    width: 550px;
    min-width: 300px;
    text-align: right;
    padding: 25px 15px 0 0;
}
#volumeIcon {
    color: rgb(212, 212, 212);
    width: 27px;
    height: 27px;
    position: relative;
    top: 8px;
}
#volume {
    width: 130px;
    height: 7px;
    outline: none;
    -webkit-appearance: none;
    background-color: rgb(50, 50, 50);
    border-radius: 20px;
    border: 0;
    cursor: pointer;
}
#volume::-webkit-slider-runnable-track {
    background: rgb(50, 50, 50);
    height: 7px;
    border-radius: 20px;
}
#volume::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: rgb(212, 212, 212);
    height: 7px;
    width: 20px;
    border-radius: 20px;
}
#volume::-moz-range-thumb {
    background-color: rgb(212, 212, 212);
    height: 7px;
    width: 20px;
    border-radius: 20px;
    border: none;
}
#volume::-moz-range-progress {
    background-color: rgb(168, 61, 61);
    border-radius: 20px;
    height: 7px;
}
</style>