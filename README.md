# devportal-tutorials-js

_Javascript Tutorials for the Developer Portal_

These examples/tutorials will familiarize you with the basics of operating on the steem blockchain.

Each tutorial is located in its own folder, and has a README.md with an outline of the basic concepts
and operations it intends to teach.

The tutorials build on each other. It's suggested you go through them in-order.

## Tutorial List

1.  [Blog Feed](tutorials/01_blog_feed) - Pull the list of a user's posts from the blockchain
1.  [Steemconnect](tutorials/02_steemconnect) - Getting started with setting up Steemconnect
1.  [Client-side signing](tutorials/03_client_signing) - Generate, sign, verify and broadcast transactions via client-side without Steemconnect
1.  [Get posts with filters](tutorials/04_get_posts) - How to query for posts with specific filters & tags
1.  [Get post details](tutorials/05_get_post_details) - How to get details of each post
1.  [Get voters list on content](tutorials/06_get_voters_list_on_post) - How to get voters info on post/comment
1.  [Get post comments](tutorials/07_get_post_comments) - How to fetch all comments made on particular post
1.  [Get account replies](tutorials/08_get_account_replies) - How to get list of latest comments made on content of particular account
1.  [Get account comments](tutorials/09_get_account_comments) - How to get list of comments made by particular account
1.  [Submit post](tutorials/10_submit_post) - How properly format and submit post
1.  [Submit comment](tutorials/11_submit_comment_reply) - How to submit reply to particular post
1.  [Edit content](tutorials/12_edit_content_patching) - How to properly patch edited content and submit edits
1.  [Stream blockchain](tutorials/13_stream_blockchain_transactions) - How to stream blockchain transactions as they accepted by network
1.  [Reblog/Resteem a post](tutorials/14_reblogging_post) - How to reblog/resteem a post
1.  [Search accounts](tutorials/15_search_accounts) - Search for user accounts by partial username
1.  [Search for tags](tutorials/16_search_tags) - Search for trending tags
1.  [Search for tags](tutorials/17_vote_on_content) - Vote on content

## To Run one of the tutorials

Use the command line/terminal for the following instructions

1.  clone this repo

    `git clone git@github.com:steemit/devportal-tutorials-js.git`

1.  cd into the tutorial you wish to run

    ex: `cd tutorials/01_blog_feed`

1.  Use npm or yarn to install dependencies

    ex: `npm i`

1.  Run the tutorial

    `npm run dev-server` or `npm run start`

1.  After a few moments, the server should be running at
    [http://localhost:3000/](http://localhost:3000/)

## Contributing

If you're interested in contributing a tutorial to this repo. Please have a look at
[the guidelines](./tutorials/tutorial_structure.md) for the text portion of the tutorial..
