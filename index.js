'use strict';

var chokidar = require('chokidar');

function wrapCallback(cb){

  function onChange(evt, path) {
    cb();
  }

  return onChange;
}

function watch(glob, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }

  opt = opt || {};

  var fn;
  if (typeof cb === 'function') {
    fn = wrapCallback(cb);
  }

  if (opt.ignoreInitial == null) {
    opt.ignoreInitial = true;
  }

  var watcher = chokidar.watch(glob, opt);
  if (fn) {
    watcher
      .on('change', fn)
      .on('unlink', fn)
      .on('add', fn);
  }

  return watcher;
}

module.exports = watch;
