'use strict'

const EventEmitter = require('events').EventEmitter

const nr = require('newrelic')

class CustomQueue extends EventEmitter{
  constructor() {
    super()

    this.nr = nr
    this.tasks = []
    this.isProcessing = false
  }

  pushTask(task) {
    // 1. transaction 1 active
    // 2. transaction 2 active
    this.tasks.push(task)

    // 1. isProcessing === false
    // 2. isProcessing === true -> do nothing
    if (!this.isProcessing) {
      // 1. _processNext w/ transaction 1 active
      // -> setImmediate
      // -> maintains state
      this._processNext()
    }
  }

  _processNext() {
    this.isProcessing = true

    const nextTask = this.tasks.shift()
    console.log('scheduling task')

    // 1. transaction 1 active -> prop setImmediate
    setImmediate(nextTask, this._afterTask.bind(this))
  }

  _afterTask() {
    // 1. transaction 1 active
    this.isProcessing = false

    if (this.tasks.length === 0) {
      this.emit('drain')
      return
    }

    // 1. process next for tran 2
    this._processNext()
  }
}

module.exports = CustomQueue
