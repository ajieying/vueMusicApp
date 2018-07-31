<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :data="songs" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
import SongList from '@/base/song-list/song-list'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {prefixStyle} from '@/common/js/dom'
import {getVkey} from '@/api/singer'
import {mapActions} from 'vuex'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
const RESERVED_HEIGHT = 40
export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.url = ''
  },
  mounted() {
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imgHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        // zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      let $this = this
      $this.getUrl($this.songs, index, function (url) {
        $this.selectPlay({
          list: $this.songs,
          index: index,
          url: url
        })
      })
      // getVkey(this.songs[index].mid).then(res => {
      //   // console.log(res.data.items[0].vkey)
      //   let url = `https://dl.stream.qqmusic.qq.com/C400${this.songs[index].mid}.m4a?vkey=${res.data.items[0].vkey}&guid=3786547700&uin=0&fromtag=66`
      //   this.selectPlay({
      //     list: this.songs,
      //     index: index,
      //     url: url
      //   })
      // })
    },
    getUrl(list, index, callback) {
      const $this = this
      getVkey(list[index].mid).then(res => {
        // console.log(res.data.items[0].vkey)
        $this.url = `https://dl.stream.qqmusic.qq.com/C400${list[index].mid}.m4a?vkey=${res.data.items[0].vkey}&guid=3786547700&uin=0&fromtag=66`
        typeof callback === 'function' && callback($this.url)
      })
    },
    random() {
      let $this = this
      $this.randomPlay({
        list: $this.songs,
        callback: function (list) {
          $this.getUrl(list, 0, function (url) {
            $this.switchSong({
              index: 0,
              url: url
            })
            $this.$nextTick(() => {
              $this.randomSetPlayingState()
            })
          })
        }
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay',
      'switchSong',
      'randomSetPlayingState'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~@/common/stylus/variable"
@import "~@/common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
