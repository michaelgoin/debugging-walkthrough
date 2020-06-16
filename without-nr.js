'use strict'

const CustomQueue = require('./custom-queue')
const queue = new CustomQueue()

queue.pushTask(function first(done) {
  doWork1()

  done()
})

function doWork1() {
  // do some work
}

queue.pushTask(function second(done) {
  doWork2()

  done()
})

function doWork2(cb) {
  // do some work
}

queue.once('drain', () => {
  console.log('queue drained')
  process.exit()
})
