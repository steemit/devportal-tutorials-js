# Blog Feed

This tutorial pulls a list of the most recent five user's posts from the blockchain and displays them.

All blockchain accessing code runs in the browser.

## Get Discussions By Blog

To request the posts written by a certain author using `getDiscussionsByBlog`, we need to pass `query` as an argument:

```javascript
const query = {
    tag: 'steemitblog',
    limit: 5
};
```

If you change the `tag` value to some other valid author, the results will contain that author instead.

The results in this example are limited to 5, but we can request up to 100.

### Pagination

To get the next *n* results, use the last `permlink` in the result as `start_permlink`, e.g.:

```javascript
const query = {
    tag: 'steemitblog',
    limit: 5,
    start_author: 'steemitblog',
    start_permlink: 'the-new-steemit-logo-is-here'
};
```

This will return the next five posts, from `start_permlink`, inclusive.

## Troubleshooting

### The results are blank.

* Ensure the author mentioned in the `tag` value is a valid author.
* Double-check that the author has posts.  This method does not retrieve replies (comments).
* Ensure the size of `limit` is not larger than 100.

### I got an error in the console: `Cannot read property '0' of undefined`

This tutorial is simple and assumes a certain format of `json_metadata` in each post.  The contents of `json_metadata` is not enforced when the post is created so a robust client needs to consider all of these situations.

Try a different author, or change:

```javascript
const image = JSON.parse(post.json_metadata).image[0];
```

... to:

```javascript
const image = null;
```
This tutorial will explain and show you how to access the **Steemit** blockchain using the **steemjs** library to build a basic blog list of posts filtered by a *tag*
