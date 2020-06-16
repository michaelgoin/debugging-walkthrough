'use strict'

const EventEmitter = require('events').EventEmitter

class CustomQueue extends EventEmitter{
  constructor() {
    super()

    this.tasks = []
    this.isProcessing = false
  }

  pushTask(task) {
    this.tasks.push(task)
    if (!this.isProcessing) {
      this._processNext()
    }
  }

  _processNext() {
    this.isProcessing = true

    const nextTask = this.tasks.shift()
    setImmediate(nextTask, this._afterTask.bind(this))
  }

  _afterTask() {
    this.isProcessing = false

    if (this.tasks.length === 0) {
      this.emit('drain')
      return
    }

    this._processNext()
  }
}

module.exports = CustomQueue
