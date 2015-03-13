"use strict";
var fs = require('fs');
var path = require('path');
var async = require('async');
var child_process = require('child_process');

var fsPath = {
  _win32: process.platform === 'win32',
  init: function () {
    if (!child_process.execSync) {
      throw new Error('your node.js version is to low(<0.11.12).')
    }
    return this;
  },
  mkdir: function (dist, callback) {
    dist = path.resolve(dist);
    fs.exists(dist, function (exists) {
      if (!exists) {
        fsPath.mkdir(path.dirname(dist), function () {
          fs.mkdir(dist, function (err) {
            callback && callback(err);
          });
        });
      } else {
        callback && callback(null);
      }
    });
  },
  mkdirSync: function (dist) {
    dist = path.resolve(dist);
    if (!fs.existsSync(dist)) {
      fsPath.mkdirSync(path.dirname(dist));
      fs.mkdirSync(dist);
    }
  },
  copy: function (from, dist, callback) {
    var that = this,
      cmd = '';
    dist = path.resolve(dist);
    fs.lstat(from, function (err, stats) {
      if (err) {
        callback(err);
      } else {
        if (that._win32) {
          // windows
          if (stats.isDirectory()) {
            cmd = 'echo da|xcopy /s /e "' + path.join(from, '*') + '" "' + dist + '"';
          } else {
            cmd = 'echo fa|xcopy /s /e "' + from + '" "' + dist + '"';
          }
        } else {
          // linux or mac
          cmd = 'cp -r "' + from + '" "' + dist + '"';
        }
        child_process.exec(cmd, function (error, stdout, stderr) {
          callback && callback(error);
        });
      }
    });
  },
  copySync: function (from, dist) {
    var cmd = '';
    var stats = fs.lstatSync(from);
    dist = path.resolve(dist);
    if (this._win32) {
      // windows
      if (stats.isDirectory()) {
        cmd = 'echo da|xcopy /s /e "' + path.join(from, '*') + '" "' + dist + '"';
      } else {
        cmd = 'echo fa|xcopy /s /e "' + from + '" "' + dist + '"';
      }
    } else {
      // linux or mac
      cmd = 'cp -r "' + from + '" "' + dist + '"';
    }
    child_process.execSync(cmd);
  },
  remove: function (from, callback) {
    var cmd = '';
    if (this._win32) {
      // windows
      cmd = 'rd /s /q "' + from + '"';
    } else {
      // linux or mac
      cmd = 'rm -rf "' + from + '"';
    }
    child_process.exec(cmd, function (error, stdout, stderr) {
      callback && callback(error);
    });
  },
  removeSync: function (from) {
    var cmd = '';
    if (this._win32) {
      // windows
      cmd = 'rd /s /q "' + from + '"';
    } else {
      // linux or mac
      cmd = 'rm -rf "' + from + '"';
    }
    child_process.execSync(cmd);
  },
  find: function (from, regexp, callback) {
    var filelist = {
      dirs: [],
      files: []
    };
    if (typeof regexp === 'function') {
      callback = regexp;
      regexp = null;
    }
    fs.readdir(from, function (err, files) {
      if (err) {
        callback && callback(err);
      } else {
        async.each(files, function (file, callback) {
          var file = path.join(from, file);
          fs.lstat(file, function (err, stats) {
            if (err) {
              callback(err);
            } else {
              if (stats.isDirectory()) {
                if (typeof regexp !== 'object' || regexp.test && regexp.test(file)) {
                  filelist.dirs.indexOf(file) === -1 && filelist.dirs.push(file);
                  fsPath.find(file, function (err, files) {
                    if (err) {
                      callback && callback(err);
                    } else {
                      files.dirs.forEach(function (_dir) {
                        filelist.dirs.indexOf(_dir) === -1 && filelist.dirs.push(_dir);
                      });
                      filelist.files = filelist.dirs.concat(files.files);
                      callback && callback(null);
                    }
                  });
                }
              } else {
                if (!regexp || regexp.test(file)) {
                  filelist.files.push(file);
                }
                callback && callback(null);
              }
            }
          });
        }, function (err) {
          if (err) {
            callback && callback(err);
          } else {
            callback && callback(null, filelist);
          }
        });
      }
    });
  },
  findSync: function (from, regexp) {
    var filelist = {
      dirs: [],
      files: []
    };
    fs.readdirSync(from).forEach(function (file) {
      file = path.join(from, file);
      var stats = fs.lstatSync(file);
      if (stats.isDirectory()) {
        if (typeof regexp !== 'object' || regexp.test && regexp.test(file)) {
          filelist.dirs.indexOf(file) === -1 && filelist.dirs.push(file);
          var files = fsPath.findSync(file);
          files.dirs.forEach(function (_dir) {
            filelist.dirs.indexOf(_dir) === -1 && filelist.dirs.push(_dir);
          });
          filelist.files = filelist.files.concat(files.files);
        }
      } else {
        filelist.files.push(file);
      }
    });
    return filelist;
  },
  writeFile: function (dist, content, encoding, callback) {
    dist = path.resolve(dist);
    if (typeof encoding === 'function') {
      callback = encoding;
      encoding = 'utf-8';
    }
    fs.writeFile(dist, content, {
      encoding: encoding
    }, callback);
  },
  writeFileSync: function (dist, content, encoding) {
    dist = path.resolve(dist);
    if (typeof encoding === 'function') {
      callback = encoding;
      encoding = 'utf-8';
    }
    fs.writeFileSync(dist, content, {
      encoding: encoding
    });
  }
};
module.exports = fsPath.init();