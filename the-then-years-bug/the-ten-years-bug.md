The Ten Years Bug
=========================

Developers often make mistakes. Bugs go unnoticed, uncaught by unit tests, overlooked by QA and reach production. Sometimes it's just a minor issue, sometimes it's major bug that costs you lost data and users' confidence. Whatever it is, the issue gets fixed. You patch the bug, mend corrupt data and everything gets back to its place.

Surely there isn't a bug that is unfixable right?

Our snippet
------------
As a prologue to this story I'll tell you about our snippet. To use [Jaco](https://getjaco.com), just sign up, copy a small snippet to your site, and your users' sessions start to be recorded. The main goal of the snippet is this:

```
var scriptNode = document.createElement('script');
scriptNode.src = scriptSrc;
// ...
head.appendChild(scriptNode);
```
We simply create a new script tag on the hosting page, which loads our main recorder.js file. The recorder.js file itself is hosted on Amazon S3 storage.

First symptoms
------------
It all started with a collection of unrelated bugs. An 'unable to get property '2' of undefined' here, an 'undefined is not a function' there. All seemingly minor bugs. But for some reason those became legendary. We fixed them, but they persisted. We could no longer recreate them, but they kept popping up in the logs consistently and regularly. Many hours were spent in the attempt to debug them.

The horrid realization
------------
It has been some time before our CTO inspected our recorder deployment gulp task, and found this piece of code:

```javascript
function uploadToS3(bucketName, region) {
  let publisher = awspublish.create(
    {
      region: region,
      params: {
        Bucket: bucketName
      }
    }
  );

  let headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src(paths.dist + '/**/*.*')
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers), 20))
    .pipe(awspublish.reporter());
}
```

There is a horrible reality hidden in this piece of code. The Cache-Control max-age is set to 315360000. 315360000 seconds are - 5256000 minutes which are 87600 hours - 3650 days. 10 years.

What is Cache-Control?
------------
Cache-Control is the modern method to customize the browsers caching policy. Its an HTTP header that should come with every resource file you serve.

This caching policy aims to help the browser answer questions like
* Should the browser cache a file?
* How should the browser know that a cached file is no longer valid?

The answer to the second question is the 'max-age' directive. Cache-Control max-age is our way to tell the browser - 'this resource is good for this amount of seconds. Cache it, and don't check on it until then'.

The purpose is clear - minimize the amounts of calls from client to server. Even calls that result in a "304 Not modified" are suboptimal.

Now lets look at the header we attached to our recorder.js file:

```javascript
'Cache-Control': 'max-age=315360000, no-transform, public'
```

We just told all of our end users browsers to cache our recorder for 10 years without downloading new versions, or doing any kind of communication with S3 to check for a change in the caching policy. All the minor bugs we fixed in the past still linger in our end users caches, and worse, we don't have anything to do about it. Fuck.

What we did
-----------
Under different circumstances this wouldn't be a big issue. Just change the filename and be done with it. But in our case, changing the filename means changing the snippet, and changing the snippet means contacting every client, and asking nicely to update their code.

Well it couldn't be helped. We've created recorder_v2.js, and sent out an email to all our customers with an explanation and instructions how to change the snippet. As an auxiliary fix we've configured S3 to permanently redirect all recorder.js requests to recorder_v2.js

What we should have done in the first place
-----------------------
As we now understand we definitely should not have added the max-age=315360000 to our file headers. But what is the correct cache configuration?

In choosing the best caching policy we need to confront a tradeoff between the amount of time new file versions propagate to all users, and the amount of requests to server we perform.

Lets examine some techniques:

**Small max-age value - mediocre update propagation, few requests to server**
  Having a small max-age value allows us to minimize the amount of request drastically. A user that traverses serveral pages of a site would only request a single request to the server, either to download the resource, or make sure the file did not change, thus validating the cache.

**use the no-cache directive - updates propagate immediately, each use of file requires a request to server**
  The no-cache directive will tell the browser to always request the file from the server. Most of these requests will turn out to be "304 not modified".
  This will result in an immediate discovery of new file version, but will cost us in many request to server.

  Note 1 - There's more to it. in order for the server to know the cached file is different from the most recent version, you have to make sure your server is configured to produce ETags. You can read more about it [here](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=en#validating-cached-responses-with-etags).

  Note 2 - Don't confuse the no-cache directive with the no-store directive. The latter will prevent the browser from storing any file cache. This will result in re-downloading said file each and every time a user access it.

**Large max-age with cache busting hashes - immediate update propagation, very few requests to server**
  When possible, this is an awesome approach. Using a large max-age value, you instruct the browser to cache a file for a long time. When you change the file, you also change its name. When the browser reach the updated file, it won't recognize it, download and cache it again.

The solution that we found most right for us was a max-age of 30 minutes. We strive to make as less impact on our end users experience and are willing to make this compromise in order to achieve it.
Unfortunately the third option is irrelevant for us. As we cannot change our snippet, we cannot add a cache busting hash to our recorder(_v2).js file

In conclusion
------------
We're not sure how this has come to pass. But we've all learned from it and be much more careful when configuring caching policy.

Caching is a very powerful tool. If you haven't done so already, read [Googles performance guide](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency) and understand how to use it. I hope that this post will help you to avoid blunders such as this.
