'use strict'

const nr = require('newrelic')

const CustomQueue = require('./custom-queue')
const queue = new CustomQueue()

nr.agent.on('transactionFinished', (transaction) => {
  console.log('transaction ended: ', transaction.name)
})

nr.startBackgroundTransaction('first work batch', () => {
  const transaction = nr.getTransaction()

  queue.pushTask(function first(done) {
    console.log('start first')
    nr.startSegment('first batch segment', true, doWork1)

    console.log('ending first work batch')

    transaction.end()

    done()
  })
})

function doWork1() {
  // do some work
}

nr.startBackgroundTransaction('second work batch', () => {
  const transaction = nr.getTransaction()
  const seg = nr.shim.getActiveSegment()
  queue.pushTask(function second(done) {
    console.log('start second')
    nr.shim.setActiveSegment(seg)
    nr.startSegment('second batch segment', true, doWork2)

    console.log('ending second work batch')

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
