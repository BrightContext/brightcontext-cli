#!/usr/bin/env node

/*global require, process */

(function () {
  'use strict';

  var
    argv = require('optimist').argv,
    bcc = require('brightcontext'),
    ctx, project, buffer = ''
  ;


  function tokenize (chunk, cb) {
    var i, c,
        brace_count = 0,
        head = 0,
        tail = 0,
        complete_messages = []
    ;

    buffer += chunk.toString();

    for (i in buffer) {
      c = buffer[i];
      
      switch (c) {
        case '{' : {
          ++brace_count;
        } break;
        
        case '}' : {
          --brace_count;

          if (0 === brace_count) {
            tail = parseInt(i, 10) + 1;
            complete_messages.push(buffer.substring(head, tail));
            head = tail;
          }
        } break;

        default: break;
      }
    }

    complete_messages.forEach(cb);
    buffer = buffer.substring(tail);
  }


  function processStdin (f, cb) {
    process.stdin.resume();

    process.stdin.on('data', function (chunk) {
      tokenize(chunk, function (obj) {
        if (obj && obj != '{}') {
          if (argv.dryrun) {
            process.stdout.write(' >> ' + obj + '\n');
          } else if (f) {
            f.send(JSON.parse(obj));
          }
        } else {
          process.stdout.write('skipping null object');
        }
      });
    });

    process.stdin.on('end', function() {
      cb();
    });
  }

  function die (err) {
    process.stdout.write(err);
    process.exit(13);
  }

  if (argv.dryrun) {
    processStdin(null, process.exit);
  } else {
    ctx = bcc.init(argv.apikey);
    project = ctx.project(argv.project);

    if (argv.inputchannel) {
      project.feed({
        channel: argv.inputchannel,
        name: argv.inputname,
        onopen: function (f) {
          processStdin(f, function () {
            ctx.shutdown(function () {
              process.exit();
            });
          });
        },
        onerror: die
      });
    }

    if (argv.outputchannel) {
      project.feed({
        channel: argv.outputchannel,
        name: argv.outputname,
        onmsg: function (f, m) {
          process.stdout.write(JSON.stringify(m) + '\n');
        },
        onerror: die
      });
    }
  }

}());

