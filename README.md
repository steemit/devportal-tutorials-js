# devportal-tutorials-js

_Javascript Tutorials for the Developer Portal_

These examples/tutorials will familiarize you with the basics of operating on the steem blockchain.

Each tutorial is located in its own folder, and has a README.md with an outline of the basic concepts
and operations it intends to teach. Some of the tutorials use the production blockchain, others use a [testnet](#Production-Blockchain-vs.-Testnet).

The tutorials build on each other. It's suggested you go through them in-order.

## Tutorial List

1.  [Blog Feed](tutorials/01_blog_feed) - Pull the list of a user's posts from the blockchain.
1.  [Steemconnect](tutorials/02_steemconnect) - Getting started with setting up Steemconnect.
1.  [Client-side signing](tutorials/03_client_signing) - Generate, sign, verify and broadcast transactions via client-side without Steemconnect.
1.  [Get posts with filters](tutorials/04_get_posts) - How to query for posts with specific filters & tags.
1.  [Get post details](tutorials/05_get_post_details) - How to get details of each post.
1.  [Get voters list on content](tutorials/06_get_voters_list_on_post) - How to get voters info on post/comment.
1.  [Get post comments](tutorials/07_get_post_comments) - How to fetch all comments made on particular post.
1.  [Get account replies](tutorials/08_get_account_replies) - How to get list of latest comments made on content of particular account.
1.  [Get account comments](tutorials/09_get_account_comments) - How to get list of comments made by particular account.
1.  [Submit post](tutorials/10_submit_post) - How properly format and submit post.
1.  [Submit comment](tutorials/11_submit_comment_reply) - How to submit reply to particular post.
1.  [Edit content](tutorials/12_edit_content_patching) - How to properly patch edited content and submit edits.
1.  [Stream blockchain](tutorials/13_stream_blockchain_transactions) - How to stream blockchain transactions as they accepted by network.
1.  [Reblog/Resteem a post](tutorials/14_reblogging_post) - How to reblog/resteem a post
1.  [Search accounts](tutorials/15_search_accounts) - Search for user accounts by partial username.
1.  [Search for tags](tutorials/16_search_tags) - Search for trending tags.
1.  [Vote on content](tutorials/17_vote_on_content) - Create a weighted up or down vote on a comment/post.
1.  [Follow a user](tutorials/18_follow_a_user) - Follow and unfollow a user / author.
1.  [Get follower & following list](tutorials/19_get_follower_and_following_list) - Get the followers of a user/author & the authors that user is following.
1.  [Account reputation](tutorials/20_account_reputation) - Learn how to interpret account reputation.
1.  [Transfer STEEM & SBD](tutorials/21_transfer_steem_and_sbd) - Transfer both STEEM and SBD from one account to another.
1.  [Witness listing & voting](tutorials/22_witness_listing_and_voting) - Create a list of available witnesses as well as vote for and remove your vote for a witness.
1.  [Claim rewards](tutorials/23_claim_rewards) - Learn how to claim rewards from unclaimed reward balance using Steemconnect as well as client signing method.
1.  [Power up](tutorials/24_power_up_steem) - Power up an account's Steem using either Steemconnect or a client-side signing.
1.  [Power down](tutorials/25_power_down) - Perform a power down on all or part of an account's VESTS using either Steemconnect or client-side signing.
1.  [Create account](tutorials/26_create_account) - Create Steem account using Steemconnect as well as with client-side signing.
1.  [Delegate steem power](tutorials/27_delegate_power) - Delegate power to other users using Steemconnect or Client-side signing.
1.  [Set withdraw route](tutorials/28_set_withdraw_route) - Set routes to an account's power downs or withdraws.
1.  [Get delegations by user](tutorials/29_get_delegations_by_user) - View the vesting delegations made by a user as well as the delegations that are expiring.
1.  [Grant posting permission](tutorials/30_grant_posting_permission) - How to grant and revoke posting permission to another user.

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

## Production Blockchain vs. Testnet

These tutorials favor use of the production Steem blockchain. However, some produce content that would be spammy. And
spam on a blockchain, like everything else on a blockchain, is forever. Eww.

So for those tutorials we use a [testnet](https://testnet.steem.vc/) setup and maintained by user
[@almost-digital](https://steemit.com/@almost-digital). You can see its current status, and learn how to easily create
accounts and connect to it at [https://testnet.steem.vc/](https://testnet.steem.vc/). And depending on the day, you can
even use an outdated version of [condenser](https://github.com/steemit/condenser) to crawl it at
[https://condenser.steem.vc/](https://condenser.steem.vc/)

Credentials for demo accounts on the testnet are in [tutorials/configuration.js](tutorials/configuration.js)`.
Because this information is public, someone may have changed the keys of these accounts. If this has happened,
you can either wait until the testnet reboots, or create an account or two of your own.
_[It's super easy](https://testnet.steem.vc/#account-creation)_

## Contributing

If you're interested in contributing a tutorial to this repo. Please have a look at
[the guidelines](./tutorials/tutorial_structure.md) for the text portion of the tutorial..
