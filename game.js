console.log('Dojo Ball')

import './assets/style.css'

// Tweakables
const stiffness = 800
const impactVelocityCompressionMultiplier = 0.01
const maxCompression = 1
const maxImpactVelocity = 20
const velocityBounceFactor = 0.5
const gravityAcceleration = 250
const mouseKick = 120
const minYToScore = 2
const minClicksToScore = 2

import { easing, physics, spring, tween, styler, listen, value, transform } from 'popmotion'
const { pipe, clampMax } = transform

const ball = document.querySelector('.ball')
const ballStyler = styler(ball)
const ballScale = value(1, (v) => {
  ballStyler.set('scaleX', 1 + (1 - v))
  ballStyler.set('scaleY', v)
})

console.log("start game")


let count = 0
let highScore = localStorage.getItem('highscore') || 0
let currentScore = 0
let tapScore = 0
let lowY = 0
let isFalling = false


$('#highScore').text(highScore)

const ballY = value(0, (v) => {
  ballStyler.set('y', Math.min(0, v))
  if (v < lowY) {
    updateLowY(v)
  }
})

function updateLowY (y) {
  lowY = y
  $('#bestHeight').text(Math.ceil(-y))
  setScore(tapScore, -ballY.get())
  console.log("New lowY: " + lowY)
}

const ballBorder = value({
  borderColor: '',
  borderWidth: 0
}, ({ borderColor, borderWidth }) => ballStyler.set({
  boxShadow: `0 0 0 ${borderWidth}px ${borderColor}`
}))

const checkBounce = () => {
  if (!isFalling || ballY.get() < 0) return

  isFalling = false
  const impactVelocity = ballY.getVelocity()
  const compression = spring({
    to: 1,
    from: 1,
    velocity: - impactVelocity * impactVelocityCompressionMultiplier,
    stiffness: stiffness
  }).pipe((s) => {
    if (s >= maxCompression) {
      s = maxCompression
      compression.stop()

      if (impactVelocity > maxImpactVelocity) {
        isFalling = true
        gravity
          .set(0)
          .setVelocity(- impactVelocity * velocityBounceFactor)
      }
    }
    return s
  }).start(ballScale)
}

const checkFail = () => {
  if (ballY.get() >= 0 && ballY.getVelocity() !== 0 && ball.innerHTML !== 'Tap') {
    count = 0
    tween({
      from: { borderWidth: 0, borderColor: 'rgb(255, 28, 104, 1)' },
      to: { borderWidth: 30, borderColor: 'rgb(255, 28, 104, 0)' }
    }).start(ballBorder)

    ball.innerHTML = 'Tap'
    currentScore = 0
    $('#currentScore').text(currentScore)
  }
}

const gravity = physics({
  acceleration: gravityAcceleration,
  restSpeed: false
}).start((v) => {
  ballY.update(v)
  checkBounce(v)
  checkFail(v)
})

function setTapScore(hs) {
  tapScore = hs
  $('#tapScore').text(tapScore)
  setScore(tapScore, -ballY.get())
}

function setScore (taps, y) {
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

listen(ball, 'mousedown touchstart').start((e) => {
  e.preventDefault()
  count++
  if (count > tapScore) {
    setTapScore(count)
  }

  ball.innerHTML = count

  isFalling = true
  ballScale.stop()
  ballScale.update(1)

  gravity
    .set(Math.min(0, ballY.get()))
    .setVelocity(-mouseKick)

  tween({
    from: { borderWidth: 0, borderColor: 'rgb(20, 215, 144, 1)' },
    to: { borderWidth: 30, borderColor: 'rgb(20, 215, 144, 0)' }
  }).start(ballBorder)
})
