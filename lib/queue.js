'use strict';

function asyncTaskQueue() {
  var queue = [];

  return {
    add: function addTask(task) {
      queue.unshift(task);
    },
    remove: function removeTask(task) {
      for (var i = 0; i < queue.length; i += 1) {
        if (queue[i] === task) {
          queue.splice(i, 1);
          return;
        }
      }
    },
    all: function allTasks() {
      return queue.slice(0);
    }
  };
}

module.exports = asyncTaskQueue;
