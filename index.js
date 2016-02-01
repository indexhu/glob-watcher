'use strict';

var chokidar = require('chokidar');
var asyncDone = require('async-done');

function watch(glob, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }

  opt = opt || {};

  if (opt.ignoreInitial == null) {
    opt.ignoreInitial = true;
  }

  var queued = false;
  var running = false;

  function runComplete(err) {
    // TODO: report errors
    running = false;

    // If we have a run queued, start onChange again
    if (queued) {
      queued = false;
      onChange();
    }
  }

  function onChange() {
    if (running) {
      queued = true;
      return;
    }

    if (typeof cb === 'function') {
      running = true;
      asyncDone(cb, runComplete);
    }
  }

  var watcher = chokidar.watch(glob, opt);

  watcher
    .on('change', onChange)
    .on('unlink', onChange)
    .on('add', onChange);

  return watcher;
}

module.exports = watch;
