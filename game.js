// Tweakables
const stiffness = 800
const impactVelocityCompressionMultiplier = 0.01
const maxCompression = 1
const maxImpactVelocity = 20
const velocityBounceFactor = 0.5
const gravityAcceleration = 250
const mouseKick = 120

import {setTapScore, checkFail} from './score.js'
import { easing, physics, spring, tween, styler, listen, value, transform } from 'popmotion'
const { pipe, clampMax } = transform

const ball = document.querySelector('.ball')
const ballStyler = styler(ball)
const ballScale = value(1, (v) => {
  ballStyler.set('scaleX', 1 + (1 - v))
  ballStyler.set('scaleY', v)
})

let count = 0
let isFalling = false

const ballY = value(0, (v) => {
  ballStyler.set('y', Math.min(0, v))
  //if (v < heightScore) {
  //  updateLowY(v)
  //}
})


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

const gravity = physics({
  acceleration: gravityAcceleration,
  restSpeed: false
}).start((v) => {
  ballY.update(v)
  checkBounce(v)
  checkFail(ballY, ball)
})

listen(ball, 'mousedown touchstart').start((e) => {
  e.preventDefault()
  count++
  //if (count > tapScore) {
    setTapScore(count, -ballY.get())
  //}

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
