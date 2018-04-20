# Post details

This tutorial pulls a list of the trending posts from the blockchain and displays them. And fetches content of the selected post, displays title and body of the post. 

It will explain most commonly used fields from returned object and parses body of the post.

## Fetching trending posts

As mentioned in previous tutorial you can fetch any list of posts with different filter. We are reusing some parts of previous tutorial to list 5 trending posts.

```javascript
var query = {
    tag: '', // This tag is used to filter the results by a specific post tag
    limit: 5, // This limit allows us to limit the overall results returned to 5
    truncate_body: 1 // This will truncate body of each post to 1 character, useful if you want to work with lighter array
};
```

## Post content

On selection of particular post from list, `openPost` function is fired. This function will call `get_content` function to fetch content of the post. `get_content` requires author and permlink of the post to fetch its data. 

```javascript
client.database.call('get_content',[author,permlink]).then((result)=>{
    const md = new Remarkable({html: true, linkify: true});
    
    const body = md.render(result.body);

    const content = `<div class='pull-right'><button onclick=goback()>Close</button></div><br><h2>${result.title}</h2><br>${body}<br>`;
    
    document.getElementById('postList').style.display='none';
    document.getElementById('postBody').style.display='block';
    document.getElementById("postBody").innerHTML = content;
});
```

Steem can store any format of the data, but majority of the apps follow standard markdown with mix of few html tags. After content is fetched, we use `remarkable` library to parse body of post in readable format. Post title, body is displayed with button on top right corner to go back to post list.

```javascript
	document.getElementById('postList').style.display='block';
    document.getElementById('postBody').style.display='none';
```

Go back function simply hides and shows post list.

## Query Result from post content

The result returned form the post content is a `JSON` object with the following properties:

```json
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
```

From this result you have access to everything associated to the post including additional metadata which is a `JSON` string that must be decoded to use. 

* id - unique identifier
* author - author of the post
* permlink - permanent link of the post
* category - main category/tag this post belongs to
* parent_author - parent author, in case if content is comment it will be parent post author
* parent_permlink - parent permanent link, for comment content
* title - title of the post
* body - post content or body
* json_metadata - json data that holds extra information about post
* last_update - last updated time of the post
* created - created time of the post
* active - if this post is active or archived
* last_payout - time of last payout
* depth - depth of the post
* children - number of comments/children for this post
* net_rshares - net reward shares (positive and negative reward sum)
* abs_rshares - abs reward shares
* vote_rshares -  vote reward shares
* children_abs_rshares - comments abs reward shares
* cashout_time - post reward payout time
* max_cashout_time - maximum reward payout time
* total_vote_weight - total weight of votes
* reward_weight - weight/percent of reward
* total_payout_value - total paid out amount
* curator_payout_value - curation paid out amount
* author_rewards - author reward
* net_votes - net positive votes
* root_comment - payout amount for root comment of the post
* max_accepted_payout - maximum accepted payout in SBD
* percent_steem_dollars - percentage of the reward in SBD
* allow_replies - allow replies to the post
* allow_votes - allow votes to the post
* allow_curation_rewards - allow curation reward
* beneficiaries - beneficiary accounts for this post
* url - url of the post
* root_title - root title of the post 
* pending_payout_value - pending payout amount
* total_pending_payout_value - total pending payout amount 
* active_votes - voter's list array
* replies - replies (depricated)
* author_reputation - author's reputation
* promoted - if post is promoted, its amount
* body_length - content length
* reblogged_by - users list who reblogged this post

## To run

*   clone this repo
*   cd tutorials/01_blog_feed
*   npm i
*   npm run start

