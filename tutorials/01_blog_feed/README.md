# Blog Feed

This tutorial pulls a list of the most recent five user's posts from the blockchain and displays them.

All blockchain accessing code runs in the browser.

This tutorial will explain and show you how to access the **Steem** blockchain using the [dsteem](https://github.com/jnordberg/dsteem) library to build a basic blog list of posts filtered by a _tag_

## Filtering Query

*   You can add a tag to filter the blog posts that you receive from the server
*   You can also limit the amount of results you would like to receive from the query

```javascript
var query = {
    tag: 'steemitblog', // This tag is used to filter the results by a specific post tag
    limit: 5, // This limit allows us to limit the overall results returned to 5
};
```

## Query Result

The result returned form the service is a `JSON` object with the following properties:

```json
[
    {
        "id": 37338948,
        "author": "steemitblog",
        "permlink": "join-team-steemit-at-tokenfest",
        "category": "steemit",
        "parent_author": "",
        "parent_permlink": "steemit",
        "title": "Join Team Steemit at TokenFest!",
        "body":
            "<a href=\"https://tokenfest.adria.digital\"><img src=\"https://i.imgur.com/fOScDIW.png\"/></a>\n\nHello Steemians! If you’d like to meet Team Steemit live-in-person, or are just interested in attending what promises to be a great blockchain conference, join us at <a href=\"https://tokenfest.adria.digital/\">TokenFest</a> in San Francisco from March 15th to 16th. \n\nSteemit CEO, Ned Scott, will be participating in a fireside chat alongside Steemit’s CTO, Harry Schmidt, as well as the creator of Utopian.io, Diego Pucci. Steemit will also be hosting the opening party on Thursday night and we’d certainly love to meet as many of you as possible IRL, so head on over to https://tokenfest.adria.digital/ and get your tickets while you can. \n\n*Team Steemit*",
        "json_metadata":
            "{\"tags\":[\"steemit\",\"tokenfest\",\"conference\"],\"image\":[\"https://i.imgur.com/fOScDIW.png\"],\"links\":[\"https://tokenfest.adria.digital\",\"https://tokenfest.adria.digital/\"],\"app\":\"steemit/0.1\",\"format\":\"markdown\"}",
        "last_update": "2018-03-07T23:22:54",
        "created": "2018-03-07T20:56:36",
        "active": "2018-03-13T01:40:21",
        "last_payout": "1970-01-01T00:00:00",
        "depth": 0,
        "children": 29,
        "net_rshares": "11453442114933",
        "abs_rshares": "11454054795840",
        "vote_rshares": "11454054795840",
        "children_abs_rshares": "13568695606090",
        "cashout_time": "2018-03-14T20:56:36",
        "max_cashout_time": "1969-12-31T23:59:59",
        "total_vote_weight": 3462435,
        "reward_weight": 10000,
        "total_payout_value": "0.000 SBD",
        "curator_payout_value": "0.000 SBD",
        "author_rewards": 0,
        "net_votes": 77,
        "root_comment": 37338948,
        "max_accepted_payout": "0.000 SBD",
        "percent_steem_dollars": 10000,
        "allow_replies": true,
        "allow_votes": true,
        "allow_curation_rewards": true,
        "beneficiaries": [],
        "url": "/steemit/@steemitblog/join-team-steemit-at-tokenfest",
        "root_title": "Join Team Steemit at TokenFest!",
        "pending_payout_value": "46.436 SBD",
        "total_pending_payout_value": "0.000 STEEM",
        "active_votes": [
            {
                "voter": "steemitblog",
                "weight": 0,
                "rshares": "1870813909383",
                "percent": 10000,
                "reputation": "128210130644387",
                "time": "2018-03-07T20:56:36"
            },
            {
                "voter": "kevinwong",
                "weight": 526653,
                "rshares": "2208942520687",
                "percent": 5000,
                "reputation": "374133832002581",
                "time": "2018-03-08T04:27:00"
            }
        ],
        "replies": [],
        "author_reputation": "128210130644387",
        "promoted": "0.000 SBD",
        "body_length": 754,
        "reblogged_by": []
    }
]
```

From this result you have access to everything associated to the post including additional metadata which is a `JSON` string that must be decoded to use. This `JSON` object has additional information and properties for the post including a reference to the image uploaded.

## To run

*   clone this repo
*   `cd tutorials/01_blog_feed`
*   `npm i`
*   `npm run start`

## To run in development mode

> Running in development mode will start a web server accessible from the following address: `http://localhost:3000/`. When you update the code the browser will automatically refresh to see your changes

*   clone this repo
*   `cd tutorials/01_blog_feed`
*   `npm i`
*   `npm run dev-server`
