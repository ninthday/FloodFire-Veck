// Generated by LiveScript 1.3.1
(function(){
  var fs, request, board, listCount, isSync, postList, postQueue, jar, cookie, postDone, fetchArticle, postListDone, fetchList, fetchIndex;
  fs = require('fs');
  request = require('request');
  if (process.argv.length < 3) {
    console.log("usage: lsc crawler.ls [board-name] ");
    console.log("example: lsc crawler.ls food");
    process.exit();
  }
  board = process.argv[2];
  listCount = 0;
  isSync = false;
  postList = {
    page: 0,
    post: {}
  };
  postQueue = [];
  request = request.defaults({
    jar: true
  });
  jar = request.jar();
  cookie = request.cookie("over18=1");
  postDone = function(){
    return console.log("fetch post done. ");
  };
  fetchArticle = function(idx){
    var key, url;
    for (;;) {
      key = postQueue[idx];
      if (!key) {
        break;
      }
      if (!fs.existsSync("data/" + board + "/post/" + key[0])) {
        break;
      }
      idx++;
    }
    if (idx >= postQueue.length) {
      return postDone();
    }
    url = "http://www.ptt.cc" + key[1];
    jar.setCookie(cookie, url);
    return request({
      url: url,
      jar: jar
    }, function(e, r, b){
      var c;
      if (b) {
        c = b.indexOf('<div id="main-container">');
        if (c) {
          b = b.substring(c);
        }
        b = b.replace(/(<\/?div[^>]*>\s*)+/g, '\n');
        b = b.replace(/<\/div>/g, '\n');
        b = b.replace(/<[^>]+>/g, " ");
        console.log("post", idx, key[0], (b || "").length, e, r.statusCode);
        if (e || r.statusCode !== 200) {
          return setTimeout(function(){
            return fetchArticle(r.statusCode === 404 ? idx + 1 : idx);
          }, 2000);
        }
        fs.writeFileSync("data/" + board + "/post/" + key[0], b);
      } else {
        idx = idx - 1;
      }
      return idx === postQueue.length - 1
        ? postDone()
        : setTimeout(function(){
          return fetchArticle(idx + 1);
        }, 11);
    });
  };
  postListDone = function(i){
    var res$, k;
    fs.writeFileSync("data/" + board + "/post-list.json", JSON.stringify(postList));
    res$ = [];
    for (k in postList.post) {
      res$.push([k, "/bbs/" + board + "/" + k + ".html"]);
    }
    postQueue = res$;
    console.log("fetch post list done, total " + postQueue.length + " posts.");
    console.log("fetching posts...");
    return fetchArticle(0);
  };
  fetchList = function(page){
    var url;
    if (page === 0) {
      postList.page = 0;
      return postListDone();
    }
    url = "http://www.ptt.cc/bbs/" + board + "/index" + page + ".html";
    jar.setCookie(cookie, url);
    return request({
      url: url,
      jar: jar
    }, function(e, r, b){
      var lines, i$, len$, line, ret1, ret2, ref$, href, title, author, key, that;
      console.log("list", page, e, r ? r.statusCode : "no response");
      if (e || !r || r.statusCode !== 200) {
        setTimeout(function(){
          return fetchList(page);
        }, 2000);
      }
      lines = b.replace(/(\\t)+/g).split('\n');
      for (i$ = 0, len$ = lines.length; i$ < len$; ++i$) {
        line = lines[i$];
        ret1 = /a href="([^"]+)">(.+)<\/a>\s*$/.exec(line);
        ret2 = /<div class="author">([^<]+)</.exec(line);
        if (!(ret1 || ret2)) {
          continue;
        }
        if (ret1) {
          ref$ = [ret1[1], ret1[2]], href = ref$[0], title = ref$[1];
        }
        if (ret2) {
          author = ret2[1];
        }
        key = (that = /\/([^/]+)\.html$/.exec(href)) ? that[1] : null;
        if (author && title && key) {
          if (key in postList.post && isSync) {
            return postListDone();
          }
          postList.post[key] = [author, title];
          ref$ = [null, null, null, null], author = ref$[0], title = ref$[1], href = ref$[2], key = ref$[3];
        }
      }
      postList.page = page;
      if (page % 30 === 0) {
        console.log("(write current result: " + page + " records)");
        fs.writeFileSync("data/" + board + "/post-list.json", JSON.stringify(postList));
      }
      return setTimeout(function(){
        return fetchList(page - 1);
      }, 100 + parseInt(Math.random() * 300));
    });
  };
  fetchIndex = function(){
    var url;
    url = "http://www.ptt.cc/bbs/" + board + "/index.html";
    jar.setCookie(cookie, url);
    console.log("analyzing how many lists to fetch...");
    return request({
      url: url,
      jar: jar
    }, function(e, r, b){
      var ret;
      ret = /\s+href=".+\/index(\d+)\.html">&lsaquo; 上頁<\/a>/.exec(b.replace(/[\r\n]/g, ""));
      if (!ret) {
        return console.log("cannot find the last list page index. abort.");
      }
      listCount = ret[1];
      console.log("total " + listCount + " list pages. ");
      return setTimeout(function(){
        return fetchList(listCount);
      }, 100);
    });
  };
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  if (!fs.existsSync("data/" + board)) {
    fs.mkdirSync("data/" + board);
  }
  if (!fs.existsSync("data/" + board + "/post")) {
    fs.mkdirSync("data/" + board + "/post");
  }
  console.log("fetching board '" + board + "'...");
  if (fs.existsSync("data/" + board + "/post-list.json")) {
    console.log("previous fetch found. load...");
    postList = JSON.parse(fs.readFileSync("data/" + board + "/post-list.json"));
    if (postList.page !== 0) {
      fetchList(postList.page);
    } else {
      console.log("previous fetch complete. only syncing latest update...");
      isSync = true;
      fetchIndex();
    }
  } else {
    fetchIndex();
  }
}).call(this);
