fs-path
========
[![Build Status](https://secure.travis-ci.org/pillys/fs-path.png)](http://travis-ci.org/pillys/fs-path)

Useful file utitiles. See [API Documentation](http://pillys.github.com/fs-path/#FsPath) for detailed info.

---

### find(path [,pattern] [,callback])

Recurcively scan files or scan files by regex pattern.

Callback break tow arguments: err, list

```js
var fsPath = require('fs-path');

fsPath.find('/usr/local', function(err, list){
  console.log(list.dirs);
  console.log(list.files);
});
```

The value list is an object has two keys:

```js
{
  dirs: [
    '/usr/local/test'
    '/usr/local/test/abc'
  ],
  files: [
    '/usr/local/aaa.png',
    '/usr/local/test/bbb.gif',
    '/usr/local/test/abc/ddd.html'
  ]
}
```

If you set a pattern to filter the files or directories, you can do like this:

```js
var fsPath = require('fs-path');

fsPath.find('/usr/local', /\.png/, function(err, list){
  console.log(list.dirs);
  console.log(list.files);
});
```
It will return the list:

```js
{
  dirs: [ ],
  files: [
    '/usr/local/aaa.png'
  ]
}
```

### findSync(path[ ,pattern])

Sync version of find(). Throws exception on error.


### mkdir(path[, callback])

Recursively make, if the parent path not exists, it'll create the directory automatically.

```js
var fsPath = require('fs-path');

fsPath.mkdir('/usr/local/test1/test2/test3', function(err){
  console.log('ok');
});
```

### mkdirSync(path[ ,pattern])

Sync version of mkdir(). Throws exception on error.


### copy(from, dist[, callback])

Copy a file or directory to other path, if the parent path not exists, it'll create the directory automatically.

```js
var fsPath = require('fs-path');

fsPath.copy('/usr/local/test1/test2/test3', '/usr/local/aaaa', function(err){
  console.log('ok');
});
```

### copySync(path[ ,pattern])

Sync version of copy(). Throws exception on error.


### remove(path[, callback])

Delete a file or directory.

```js
var fsPath = require('fs-path');

fsPath.remove('/usr/local/test1/test2/test3', function(err){
  console.log('ok');
});
```

### removeSync(path[ ,pattern])

Sync version of remove(). Throws exception on error.


### writeFile(path, content[, encoding][, callback])

Write a file a file or directory.

Encoding is optional, default is 'utf-8'.

```js
var fsPath = require('fs-path');

fsPath.writeFile('/usr/local/1.html', content function(err){
  console.log('ok');
});
```

### writeFileSync(path, content[, encoding])

Sync version of writeFile(). Throws exception on error.