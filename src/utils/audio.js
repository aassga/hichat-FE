
//獲取播放
export function audioPlay() {
  var audioList = document.getElementsByClassName('user-audio')
  for (let i = 0; i < audioList.length; i++) {
    let audio = audioList[i]
    audio.addEventListener("play", function (e) {
      // console.log(audio)
      // console.log("該音頻撥放中")
      for (let j = 0; j < audioList.length; j++) {
        if (j !== i) audioList[j].pause();
      }
    })
  }
}

//移除播放
export function removeAudioPlay() {
  var audioList = document.getElementsByTagName('audio')
  for (let i = 0; i < audioList.length; i++) {
    let audio = audioList[i]
    audio.removeEventListener("play", function (e) {
      // console.log(audio)
      // console.log("該音頻撥放中")
      for (let j = 0; j < audioList.length; j++) {
        if (j !== i) audioList[j].pause();
      }
    })
  }
}