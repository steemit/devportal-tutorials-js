# Purpose

**How to Submit a Post** by demonstrating the typical process of preparing content and then using the broadcast operation.

We will focus on properly formatting the content followed by broadcasting the transaction with a `demo` account.

## Description

We are using the `broadcast.comment` function provided by `dsteem` which generates, signs, and broadcast the transaction to the network.  On the Steem platform, posts and comments are all internally stored as a `comment` object, differentiated by whether or not a `parent_author` exists.  When there is no `parent_author`, the it's a post, when there is, it's a comment.

## Tutorial steps

As usual, we have a `public/app.js` file which holds the Javascript segment of the tutorial.  In the first few lines we define the configured library and packages:

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

Above, we have `dsteem` pointing to the test network with the proper chainId, addressPrefix, and endpoint.  Because this tutorial is interactive, we will not publish test content to the main network.  Instead, we're using testnet and a predefined account to demonstrate post publishing.

To get the parent author and parent permlink you can browse to an existing post and look at the url. 

```
http://condenser.steem.vc/qbvxoy72qfc/@demo/dsf0yxlox2d
```

In this case. `dsf0yxlox2d` is the parent permlink and `@demo` is the parent author.

Next, we have the `submitComment` function which executes when the Submit comment button is clicked.

```javascript
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const account = document.getElementById('username').value;
    //get body
    const body = document.getElementById('body').value;
    //get parent author permalink
    const parent_author = document.getElementById('parent_author').value;
    //get parent author permalink
    const parent_permlink = document.getElementById('parent_permlink').value;

    //generate random permanent link for post
    const permlink = Math.random()
        .toString(36)
        .substring(2);

    client.broadcast
        .comment(
            {
                author: account,
                title: '',
                body: body,
                parent_author: parent_author,
                parent_permlink: parent_permlink,
                permlink: permlink,
                json_metadata: '',
            },
            privateKey
        )
        .then(
            function(result) {
                document.getElementById('body').value = '';
                document.getElementById('parent_author').value = '';
                document.getElementById('parent_permlink').value = '';
                document.getElementById('postLink').style.display = 'block';
                document.getElementById(
                    'postLink'
                ).innerHTML = `<br/><p>Included in block: ${
                    result.block_num
                }</p><br/><br/><a href="http://condenser.steem.vc/@${parent_author}/${parent_permlink}">Check post here</a>`;
            },
            function(error) {
                console.error(error);
            }
        );
```

As you can see from the above function, we get the relevant values from the defined fields. Posts must also have a unique permanent link scoped to each account. In this case we are just creating a random character string.

The next step is to pass all of these parameters to the `client.broadcast.comment` function.  Note that in parameters you can see the `parent_author` and `parent_permlink` fields, which are used for replies (also known as comments). In our example, since we are publishing a comment we will have to enter a `parent_author` and assign `parent_permlink` from a valid existing post.

After the post has been broadcasted to the network, we can simply set all the fields to empty strings and show the post link to check it from a condenser instance running on the selected testnet.  That's it!

## How To run

*   clone this repo
*   `cd tutorials/11_submit_comment_reply`
*   `npm i`
*   `npm run start`

**To run in development mode**

> Running in development mode will start a web server accessible from the following address: `http://localhost:3000/`.  When you update your code, the browser will automatically refresh to see your changes.

*   clone this repo
*   `cd tutorials/11_submit_comment_reply`
*   `npm i`
*   `npm run dev-server`
