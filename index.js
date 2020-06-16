'use strict'

const nr = require('newrelic')

const CustomQueue = require('./custom-queue')
const queue = new CustomQueue()

nr.startBackgroundTransaction('first work batch', () => {
  queue.pushTask(function first(done) {
    nr.startSegment('first batch segment', true, doWork1)

    console.log('ending first work batch')
    const transaction = nr.getTransaction()
    transaction.end()

    done()
  })
})

function doWork1() {
  // do some work
}

nr.startBackgroundTransaction('second work batch', () => {
  queue.pushTask(function second(done) {
    nr.startSegment('second batch segment', true, doWork2)

    console.log('ending second work batch')
    const transaction = nr.getTransaction()
    transaction.end()

    done()
  })
})

function doWork2(cb) {
  // do some work
}

queue.once('drain', () => {
  console.log('queue drained')
  nr.shutdown({collectPendingData: true}, () => {
    process.exit()
  })
})
