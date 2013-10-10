#!/usr/bin/env node

/*global require, process, console */

(function () {
  'use strict';

  var
    util = require('util'),
    argv = require('optimist').argv,
    bcc = require('brightcontext'),
    ctx, project
  ;

  if (argv.environment) {
    bcc.environment.host = argv.environment;
  }

  ctx = bcc.init(argv.apikey);
  project = ctx.project(argv.project);

  project.data({
    name: argv.datastore,
    params: argv.query || {},
    ondata: function (d) {
      if (argv.pretty) {
        console.log(util.inspect(d, { depth: null }));
      } else {
        process.stdout.write(JSON.stringify(d));
      }

      ctx.shutdown(function () {
        process.exit(0);
      });
    },
    onerror: function (err) {
      console.log(err);
      process.exit(13);
    }
  });

}());

