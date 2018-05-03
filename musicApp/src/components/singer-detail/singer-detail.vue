<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters} from 'vuex' // mapGetters时候vueX提供的语法糖，作用是把state数据映射进入computed或者data中，
// import {getSingerDetail, getVkey} from '@/api/singer'
import {getSingerDetail} from '@/api/singer'
import {createSong} from '@/common/js/song'
import {ERR_OK} from '@/api/config'
import musicList from '@/components/music-list/music-list'

export default {
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDetail()
  },
  components: {
    musicList
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          // this._normalizeSongs(res.data.list).then((res) => {
          //   this.songs = res
          //   console.log(res)
          // })
          this.songs = this._normalizeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      console.log(this.singer)
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, this.vKey))
          // getVkey(musicData.songmid).then((res) => {
          //   if (res.code === ERR_OK) {
          //     const songVkey = res.data.items[0].vkey
          //     return Promise.resolve(songVkey)
          //   }
          //   return ''
          // }).then((res) => {
          //   const newSong = createSong(musicData, res)
          //   ret.push(newSong)
          //   return resolve(ret)
          // }, (err) => {
          //   reject(err)
          // })
        }
      })
      return ret
      // return new Promise((resolve, reject) => {
      //   return list.forEach((item) => {
      //     let {musicData} = item
      //     if (musicData.songid && musicData.albummid) {
      //       // ret.push(createSong(musicData, this.vKey))
      //       getVkey(musicData.songmid).then((res) => {
      //         if (res.code === ERR_OK) {
      //           const songVkey = res.data.items[0].vkey
      //           return Promise.resolve(songVkey)
      //         }
      //         return ''
      //       }).then((res) => {
      //         const newSong = createSong(musicData, res)
      //         ret.push(newSong)
      //         return resolve(ret)
      //       }, (err) => {
      //         reject(err)
      //       })
      //     }
      //   })
      // })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background:$color-background
    &.slide-enter-active,.slide-leave-active
      transition: all .3s
    &.slide-enter,&.slide-leave-to
      transform:translate3d(100%,0,0)
</style>
