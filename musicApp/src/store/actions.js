import * as types from './mutation-types'
export const selectPlay = function ({commit, state}, {list, index, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_URL, url)
}
export const switchSong = function ({commit, state}, {index, url}) {
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_CURRENT_URL, url)
}