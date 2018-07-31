/**
 * shuffle 打乱数据功能
 * @authors ljj (liu.junjie@58che.com)
 * @date    2018-05-30 15:44:32
 * @version $Id$
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}