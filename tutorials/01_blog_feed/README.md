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

