# Purpose

The purpose of this tutorial is **How to submit a post** and demonstrate typical process of preparing post and using broadcast operation.

We focus on formatting content properly and broadcasting transaction with `demo` account.

## Description

We are using `broadcast.comment` function with `dsteem`, which is generates, signs and broadcast transaction to the network. On Steem each content considered comment only with small distinction between top/root post and comments. We will explain that and steps below on how to properly prepare transaction and submit to the testnet.

## Tutorial steps

As usual, we have `public/app.js` file which holds the Javascript part of the tutorial. In first few lines we define, configure library and packages.

```javascript
const dsteem = require('dsteem');
let opts = {};
//connect to community testnet
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://testnet.steem.vc', opts);
```

`dsteem` is pointing to the test network with proper chain_id, addressPrefix and connection server.
Because this tutorial is interactive, publishing test content to main network is not suggested, for that reason we have testnet and predefined account to try out post publishing.

Next, we have `submitPost` function which fires when Submit post button is clicked.

```javascript
//get private key
const privateKey = dsteem.PrivateKey.fromString(
    document.getElementById('postingKey').value
);
//get account name
const account = document.getElementById('username').value;
//get title
const title = document.getElementById('title').value;
//get body
const body = document.getElementById('body').value;
//get tags and convert to array list
const tags = document.getElementById('tags').value;
const taglist = tags.split(' ');
//make simple json metadata including only tags
const json_metadata = JSON.stringify({ tags: taglist });
//generate random permanent link for post
const permlink = Math.random()
    .toString(36)
    .substring(2);

client.broadcast
    .comment(
        {
            author: account,
            body: body,
            json_metadata: json_metadata,
            parent_author: '',
            parent_permlink: taglist[0],
            permlink: permlink,
            title: title,
        },
        privateKey
    )
    .then(
        function(result) {
            document.getElementById('title').value = '';
            document.getElementById('body').value = '';
            document.getElementById('tags').value = '';
            document.getElementById('postLink').style.display = 'block';
            document.getElementById(
                'postLink'
            ).innerHTML = `<br/><p>Included in block: ${
                result.block_num
            }</p><br/><br/><a href="http://condenser.steem.vc/${
                taglist[0]
            }/@${account}/${permlink}">Check post here</a>`;
        },
        function(error) {
            console.error(error);
        }
    );
```

As you can see from above function, we get relevant values from defined fields. Tags are separated with space in this example, but structure of how to enter tags is totally depends on your need. We have separated tags with whitespace and stored them into array list `taglist` for later use. Post on blockchain can hold additional information in `json_metadata` field, one of which is tags list which we have assigned. Post should also have unique permanent link for each account, in this case we just creating random character string.

Next step is to pass all parameters to `client.broadcast.comment` function. Note in parameters you can see `parent_author` and `parent_permlink` fields, these are used for replies or comments. In our example we are publishing post instead of comment/reply, we will have to leave `parent_author` empty string and can assign `parent_permlink` as first tag.

After post is broadcasted to the network, we simply set all fields to empty string and show link of the post to check it from condenser instance running on selected testnet. That's it!

## How To run

*   clone this repo
*   `cd tutorials/10_submit_post`
*   `npm i`
*   `npm run start`

**To run in development mode**

> Running in development mode will start a web server accessible from the following address: `http://localhost:3000/`. When you update the code the browser will automatically refresh to see your changes

*   clone this repo
*   `cd tutorials/10_submit_post`
*   `npm i`
*   `npm run dev-server`
