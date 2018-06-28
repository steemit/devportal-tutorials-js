# Vote on Content

_By the end of this tutorial you should know how to create an up or down vote, and send it to the steem blockchain._

This tutorial will take you through the process of preparing and submitting a `vote` using the `broadcast` operation. A demo account is provided to use on the `testnet` but all variables can be easily changed and applied to the `production server`.

## Intro

We are using the `broadcast.vote` function provided by the `dsteem` library to send the transaction through to the network. On the Steem platform, posts and comments are all internally stored as a `comment` object, differentiated by whether or not a `parent_author` exists. When there is no `parent_author`, then it's a post, when there is, it's a comment. Voting is done on either of the two based on the author and permlink of the comment. There are 5 parameters required for the voting operation:

 1. _Username_ - The username of the account making the vote (the voter)
 2. _Privatekey_ - This is the private posting key of the voter
 3. _Author_ - The author of the comment/post that the voter is voting on
 4. _Permlink_ - The unique identifier of the comment/post of the author
 5. _Weight_ - This is the weight that the vote will carry. The value ranges from -10000 (100% flag) to 10000 (100% upvote)

Due to the low amount of posts on the testnet we added an additional step to create a post before we vote on it. The values are auto loaded in the respective input boxes. A full tutorial on how to create a new post can be found on the [Steem Devportal](https://developers.steem.io/tutorials-javascript/submit_post)

## Steps

1.  [**Configure connection**](#connection) Configuration of `dsteem` to communicate with a Steem blockchain
2.  [**Create new post**](#createpost) Creating a new post on the testnet
3.  [**Input variables**](#input) Collecting the required inputs via an HTML UI
4.  [**Broadcast**](#broadcast) Creating an object and broadcasting the vote to the blockchain

#### 1. Configure connection<a name="connection"></a>

As usual, we have a `public/app.js` file which holds the Javascript segment of the tutorial. In the first few lines we define the configured library and packages:

```javascript
const dsteem = require('dsteem');

//define network parameters
let opts = {};
opts.addressPrefix = 'STX';
opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to a steem node, testnet in this case
const client = new dsteem.Client('https://testnet.steem.vc', opts);
```

Above, we have `dsteem` pointing to the test network with the proper chainId, addressPrefix, and endpoint.  
Because this tutorial modifies the blockchain, we will use a testnet and a predefined account to demonstrate voting.

#### 2. Create new post<a name="createpost"></a>

A new blog post is created on the testnet with the necessary variables for the vote function being allocated as well. If a post is successfully created it will display a block number and a value will be assigned to the `permlink` variable.

```javascript
//refer to "10_submit_post" in the tutorials folder for creating a post on steemit
//create post function
window.createPost = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const account = document.getElementById('username').value;
    //get title
    const title = "New Blog";
    //get body
    const body = "This is my new test blog";
    //get tags and convert to array list
    const tags = "blog";
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
                parent_permlink: tags,
                permlink: permlink,
                title: title,
            },
            privateKey
        )
        .then(
            function(result) {
                document.getElementById('permlink').innerHTML = permlink;
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
};
```

#### 3. Input variables<a name="input"></a>

The required parameters for the vote operation is recorded via an HTML UI that can be found in the `public/index.html` file. The values are pre-populated in this case with a testnet `demo` account. The vote weight is input via a slider as this value can range between -10000 and 10000 denoting either a 100% flag or 100% upvote.

The parameter values are allocated as seen below, once the user clicks on the "Submit" button.

```javascript
window.submitVote = async () => {
    document.getElementById('voteResult').innerHTML = 'pending...'
    //get all values from the UI
    //get account name of voter
    const voter = document.getElementById('username').value;
    //get private posting key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get author of post/comment to vote
    const author = document.getElementById('author').value;
    //get post permalink to vote
    const permlink = document.getElementById('permlink').innerHTML;
    //get weight of vote
    const weight = parseInt(document.getElementById('currentWeight').innerHTML, 10);
```

The `weight` parameter is required to be an interger for the vote operation so we parse it from the UI text field. The `permlink` value is retrieved from the `create post` function which is why it is input via the `.innerHTML` operation. If it were to be manually entered it would use the same `.value` operator as the other inputs.

#### 4. Broadcast<a name="broadcast"></a>

We create a `vote object` with the input variables before we can broadcast to the blockchain.

```javascript
    const vote = new Object();
      vote.voter = voter;
      vote.author = author;
      vote.permlink = permlink;
      vote.weight = weight;
```

Afterwich we can complete the `broadcast.vote` operation with the created object and private posting key received from the input UI. The result of the vote is displayed on the UI to confirm whether it was a `success` or `failed` with details of that process being displayed on the console.

```javascript
client.broadcast.vote(vote, privateKey).then(function(result){
        console.log('included in block: ' + result.block_num, 'expired: ' + result.expired)
        document.getElementById('voteResult').innerHTML = 'Success'
    }, function(error) {
        console.error(error)
        document.getElementById('voteResult').innerHTML = 'Failed'
    })
```

More information on how to use the `broadcast` operation and options surrounding the operation can be found on the [Steem Devportal](https://developers.steem.io/apidefinitions/#broadcast_ops_vote)

### To run this tutorial

 1. clone this repo
 2. `cd tutorials/17_vote_on_content`
 3. `npm i`
 4. `npm run dev-server` or `npm run start`
 5. After a few moments, the server should be running at http://localhost:3000/
