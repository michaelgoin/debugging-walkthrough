'use strict'

const nr = require('newrelic')

const CustomQueue = require('./custom-queue')
const queue = new CustomQueue()

nr.agent.on('transactionFinished', (transaction) => {
  console.log('transaction ended: ', transaction.name)
})

// Transaction per scheduled item as that is where the measurable work happens
// and does not absorb time waiting for other tasks.

// If queue time important, would calculate that separately and attach as a metric
// or custom attribute.

queue.pushTask(function first(done) {
  nr.startBackgroundTransaction('first work batch', () => {
    const transaction = nr.getTransaction()

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



queue.pushTask(function second(done) {
  nr.startBackgroundTransaction('second work batch', () => {
    const transaction = nr.getTransaction()

    console.log('start second')

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
