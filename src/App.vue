<template>
    <div id="top_area">
        <NavBar/>
    </div>
    <div id="main_area">
        <router-view/>
    </div>
    <div class="footer">
        <p>{{ serverInfoStore.server_info.site_name }}</p>
        <p>Powered by <a href="https://github.com/LittleOrange666/OrangeJudge">OrangeJudge</a>
            {{ serverInfoStore.server_info.version_info }}</p>
    </div>
    <MyModal/>
    <CheckingModal/>
</template>

<style>
#top_area {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
}

#main_area {
    position: relative;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 76px;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    float: left;
    width: 80%;
}

/*noinspection CssUnusedSymbol*/
.copy_btn {
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    padding: 0;
    margin: 0;
    border: 0;
}

/*noinspection CssUnusedSymbol*/
.test-case {
    font-size: 1.1rem;
}

.test-case pre {
    border: 1px solid #aaa;
    background-color: #eee;
    font-size: 0.9rem;
}

.footer {
    text-align: center;
    font-size: small;
}

</style>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import MyModal from "@/components/MyModal.vue";
import CheckingModal from "@/components/CheckingModal.vue";
import {useServerInfoStore} from "@/stores/serverInfo";

const serverInfoStore = useServerInfoStore();
</script>
