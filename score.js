const minClicksToScore = 2
const minYToScore = 2

let highScore = localStorage.getItem('highscore') || 0
let currentScore = 0
let tapScore = 0
let heightScore = 0


$('#highScore').text(highScore)


const updateLowY = y => {
  heightScore = y
  $('#bestHeight').text(Math.ceil(-y))
  setScore(tapScore, -ballY.get())
  console.log("New heightScore: " + heightScore)
}

export const checkFail = (ballY, ball) => {
  if (ballY.get() >= -1 && ballY.getVelocity() !== 0 && ball.innerHTML !== 'Tap') {
    count = -1
    tween({
      from: { borderWidth: -1, borderColor: 'rgb(255, 28, 104, 1)' },
      to: { borderWidth: 29, borderColor: 'rgb(255, 28, 104, 0)' }
    }).start(ballBorder)

    ball.innerHTML = 'Tap'
    currentScore = 0
    $('#currentScore').text(currentScore)
  }
}

export const setTapScore = (hs, height) => {
  if (hs < tapScore) return
  tapScore = hs
  $('#tapScore').text(tapScore)
  setScore(tapScore, height)
}

export const setScore = (taps, y) => {
  if (taps < minClicksToScore) return
  if (y < minYToScore) return
  currentScore += Math.ceil((y*y/taps)*10 + y)
  $('#currentScore').text(currentScore)
  if (highScore < currentScore) {
    highScore = currentScore
    localStorage.setItem("highscore", highScore)
    $('#highScore').text(highScore)
  }
}

const updateView = score => {
  const highScore = localStorage.getItem('highscore')
  $('#currentScore').text(score)
  $('#highScore').text(highScore)
}


// export default {
//   setScore,
//   setTapScore,
//   checkFail,
//   updateLowY,
// }
