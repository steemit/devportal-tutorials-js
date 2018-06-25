# Follow / Unfollow user

_By the end of this tutorial you should know how to follow and unfollow a user / author._

This tutorial will take you through the process of checking the `follow status` of an author and either follow or unfollow that user depending on the current status. This is done with the `call` operation as well as the `broadcast.json` operation.

## Intro

We are using the `broadcast.json` operation provided by the `dsteem` library to follow or unfollow a selected author. There are 4 variables required to execute this operation:

*   The specific user that will select the author to follow (the `follower`).
*   The private posting key of the user.
*   The account/author that the user would like to follow (the `following`).
*   The `type` of follow operation. This will determine whether executing the operation will follow or unfollow the selected author.

A simple HTML interface is used to capture the required information after which the transaction is submitted.

## Steps

1.  [**Configure connection**](#connection) Configuration of `dsteem` to communicate with the Steem blockchain
2.  [**Input variables**](#input) Collecting the required inputs via an HTML UI
3.  [**Get status**](#status) Get the follow status for the specified author
4.  [**Follow operation**](#follow) Execute the `follow` operation

#### 1. Configure connection<a name="connection"></a>

As usual, we have a `public/app.js` file which holds the Javascript segment of the tutorial. In the first few lines we define the configured library and packages:

```javascript
const dsteem = require('dsteem');
let opts = {};
//define network parameters
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to a steem node, production in this case
const client = new dsteem.Client('https://api.steemit.com');
```

Above, we have `dsteem` pointing to the production network with the proper chainId, addressPrefix, and endpoint, eventhough this tutorial modifies the blockchain. Because of this, care has to be given to the operation and parameters used.

#### 2. Input variables<a name="input"></a>

The required parameters for the follow operation is recorded via an HTML UI that can be found in the `public/index.html` file.

The parameter values are allocated as seen below once the user clicks on the "Follow / Unfollow" button.

```javascript
window.submitFollow = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const follower = document.getElementById('username').value;
    //get author permalink
    const following = document.getElementById('author').value;
```

#### 3. Get status<a name="status"></a>

The current follow status for the author is called from the database and a variable is assigned in order to specify whether the follow operation should execute as `follow` or `unfollow`.

```javascript
console.log({ follower: follower, following: following });

    let status = await client.call('follow_api', 'get_following', [
        follower,
        following,
        'blog',
        1,
    ]);

    console.log({ status: status });

    if (status.length > 0 && status[0].following == following) {
        type = '';
    } else {
        type = 'blog';
    }
```

#### 4. Follow operation<a name="follow"></a>

A JSON object with the collected input variables is created in order for the `broadcast` operation to be created.

```javascript
const json = JSON.stringify([
        'follow',
        {
            follower: follower,
            following: following,
            what: [type] //null value for unfollow, 'blog' for follow
        }
    ]);

    const data = {
        id: 'follow',
        json: json,
        required_auths: [],
        required_posting_auths: [follower],
    };
```

Afterwhich the broadcast operation is executed with the created object and the private posting key.

```javascript
client.broadcast.json(data, privateKey).then(
        function(result) {
            console.log('user follow result: ', result);
        }, //to confirm that a block operation was done
        function(error) {
            document.getElementById('message').innerHTML = error.message;
            console.error(error);
        }
    );
```

Additionally we also display the current follow status of the author on the UI to give the user an idea of what to expect:

```javascript
if (type == 'blog') {
        console.log('followed');
        document.getElementById('followResult').innerHTML = 'FOLLOWED';
    } else {
        console.log('unfollowed');
        document.getElementById('followResult').innerHTML = 'UNFOLLOWED';
    }
```

If either of the values for the user or author does not exist the reslut of the operation will be an `unfollow`

More information on how to use the `broadcast` operation and options surrounding the operation can be found [HERE](https://developers.steem.io/apidefinitions/#apidefinitions-broadcast-ops-comment)

There is an additional button added to clear the input fields. This is not a necessary step but adds to the ease of use.

```javascript
window.clearFields = function() {
    document.getElementById('username').value = '';
    document.getElementById('postingKey').value = '';
    document.getElementById('author').value = '';
}
```

### To run this tutorial

 1. clone this repo
 2. `cd tutorials/18_follow_user`
 3. `npm i`
 4. `npm run dev-server` or `npm run start`
 5. After a few moments, the server should be running at http://localhost:3000/
