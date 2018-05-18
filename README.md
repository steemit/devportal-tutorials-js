# devportal-tutorials-js

_Javascript Tutorials for the Developer Portal_

These examples/tutorials will familiarize you with the basics of operating on the steem blockchain.

Each tutorial is located in its own folder, and has a README.md with an outline of the basic concepts
and operations it intends to teach.

The tutorials build on each other. It's suggested you go through them in-order.

## Tutorial List

1.  [Blog Feed](tutorials/01_blog_feed) - Pull the list of a user's posts from the blockchain
2.  [Steemconnect](tutorials/02_steemconnect) - Getting started with setting up Steemconnect
3.  [Client-side signing](tutorials/03_client_signing) - Generate, sign, verify and broadcast transactions via client-side without Steemconnect
4.  [Get posts with filters](tutorials/04_get_posts) - How to query for posts with specific filters & tags
5.  [Get post details](tutorials/05_get_post_details) - How to get details of each post
6.  [Get voters list on content](tutorials/06_get_voters_list_on_post) - How to get voters info on post/comment
7.  [Get post comments](tutorials/07_get_post_comments) - How to fetch all comments made on particular post
8.  [Get account replies](tutorials/08_get_account_replies) - How to get list of latest comments made on content of particular account
9.  [Get account comments](tutorials/09_get_account_comments) - How to get list of comments made by particular account
10. [Submit post](tutorials/10_submit_post) - How properly format and submit post
11. [Submit comment](tutorials/11_submit_comment_reply) - How to submit reply to particular post
12. [Edit content](tutorials/12_edit_content_patching) - How to properly patch edited content and submit edits


## To Run one of the tutorials

Use the command line/terminal for the following instructions

1.  clone this repo

    `git clone git@github.com:steemit/devportal.git`
1.  cd into the tutorial you wish to run

    ex: `cd tutorials/11_submit_comment_reply`
1.  Use npm or yarn to install dependencies
    
    ex: `npm i`
1.  Run the tutorial
 
    `npm run dev-server` or `npm run start`
1.   After a few moments, the server should be running at 
    [http://localhost:3000/](http://localhost:3000/)
    
## Contributing
If you're interested in contributing a tutorial to this repo. Please have a look at 
[the guidelines](./tutorial_structure.md) for the text portion of the tutorial..

