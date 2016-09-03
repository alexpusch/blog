The Ten Years Bug
=========================

Developers often make mistakes. Bugs goes unnoticed, uncaught by unitests, overlooked by QA and reach production. Sometimes it's just a minor issue, sometimes it's major bug that costs you lost data and users confidence. Whatever it is, the issue gets fixed. You patch the bug, mend corrupt data and everything get back to it's place.

Surly there isn't a bug that is unfixable right?

Our snippet
------------
As a prologue to this story I'll tell you about our snippet. To use [Jaco](https://getjaco.com), just sign up, copy a small snippet to your site, and your users sessions starts to get recorded. The main goal of the snippet is this:

```
var scriptNode = document.createElement('script');
scriptNode.src = scriptSrc;
// ...
head.appendChild(scriptNode);
```
We simply create a new script tag on the hosting page, which loads our main recorder.js file. The recorder.js file itself is hosted on Amazon S3 storage.

First symptoms
------------
It all started with a collection of unrelated bugs. An 'unable to get property '2' of undefined' here, an 'undefined is not a function' there. All seemingly minor bugs. But for some reason those became legendary. We fixed them, but they persisted. We could not longer recreate them, but they kept popping up in the logs consistently and regularly. Many hours were spent in the attempt to debug them.

The horrid realization
------------
It have been some time before our CTO inspected our recorder deployment gulp task, and found this piece of code:

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

There is a horrible reality hidden in this piece of code. The Cache-Control max-age is set to 315360000. 315360000 seconds, 5256000 minutes, 87600 hours, 3650 days. 10 years.

What is Cache-Control?
------------
[To quote Googles performance guide](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control) "The best request is a request that does not need to communicate with the server". Cache-Control the modern method to customize the browsers caching policy.

This policy aims to help the browser to answer questions like
* Should the browser cache a file?
* How should the browser know that a cached file is no longer valid?

The answer to the second question is the 'max-age' directive. Cache-Control max-age is our way to tell the browser - 'this resource is good for this amount of seconds. Cache it, and don't check on it until then'.

The purpose is clear - minimize the amounts of calls from client to server. Even calls that result in a "304 Not modified" are suboptimal.

TODO: add graphics

Now lets look at the header we attached to our recorder.js file:

```javascript
'Cache-Control': 'max-age=315360000, no-transform, public'
```

In other words we just told the all of our end users browsers to cache our recorder for 10 years without downloading new versions, or doing any kind of communication with S3 to check for a change in the caching policy. All the minor bugs we fixed in the past still linger in our end users caches, and worse, we don't have anything to do about it. Fuck.

What we did
-----------
Under different circumstances this won't be a big issue. Just change the filename and be done with it. But for our case, changing the filename means changing the snippet, and changing the snippet means contacting every client, and asking nicely to update their code.

Well it couldn't be helped. We've created recorder_v2.js, published an email with an explanation and instruction how to change the snippet. As an auxiliary fix we've configured S3 to permanent redirect all request to recorder.js to recorder_v2.js

These actions decreased the amount of old recorder.js file being used, but not eliminated it completely. Some clients are less cooperative with request such as ours and did not updated their snippet. Theoretically some bugs will hunt us for another 10 years.

In conclusion
------------
We're not sure how this have come to pass. But we've all learned from it and be much more careful when configuring cacheing policy.

Caching is a very powerful tool. If you haven't done so already, read [Googles performance guide](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency) and understand how to use it. I hope that this post will help you to avoid blunders such as this.
