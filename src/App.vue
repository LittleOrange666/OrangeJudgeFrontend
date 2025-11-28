<template>
  <div id="top_area">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">OrangeJudge</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" style="justify-content: space-between;">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex">
            <li class="nav-item">
              <router-link to="/" class="nav-link active">首頁</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/problems" class="nav-link active">公開題目</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contests" class="nav-link active">競賽列表</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/test" class="nav-link active">測試</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/status" class="nav-link active">解題動態</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                 aria-expanded="false">
                關於
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link to="/about_judge" class="dropdown-item">評測系統</router-link>
                </li>
                <li><a class="dropdown-item" href="https://LittleOrange666.github.io/orangejudge/">教程</a></li>
                <li><a class="dropdown-item" href="/api/api-docs">API</a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav navbar-text">
            <li class="nav-item">
              <router-link to="/login" class="nav-link active">登入</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div id="main_area">
    <router-view/>
  </div>
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
</style>
<script setup lang="ts">
</script>