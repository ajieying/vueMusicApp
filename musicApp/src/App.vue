<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/m-header/m-header'
import Tab from '@/components/tab/tab'
import RecommendTag from '@/components/recommend/recommend'
import Player from '@/components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    RecommendTag,
    Player
  }
}
</script>
<style></style>
