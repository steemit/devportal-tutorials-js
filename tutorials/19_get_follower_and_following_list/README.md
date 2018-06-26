# Get follower and following list

_By the end of this tutorial you should know how to create a list of followers and users that you are following._

This tutorial will take you through the process of calling both the `follower` and `following` functions from the STEEM API. This is done with the `call` operation available in the `dsteem` library.

## Intro

We are using the `call` operation provided by the `dsteem` library to pull the follow information for a specified user (account). Only 2 variables are required to execute this operation:

*   The specific user for which the follower/following process will be executed (the `user`).
*   The number of lines to be returned by the query (`limit`)

A simple HTML interface is used to capture the required information after which the function is executed.

## Steps

1.  [**Configure connection**](#connection) Configuration of `dsteem` to communicate with the Steem blockchain
2.  [**Input variables**](#input) Collecting the required inputs via an HTML UI
3.  [**Get followers/following**](#query) Get the followers or users being followed
4.  [**Display**](#display) Display the array of results on the UI

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

Above, we have `dsteem` pointing to the production network with the proper chainId, addressPrefix, and endpoint.

#### 2. Input variables<a name="input"></a>

The required parameters for the follow operation is recorded via an HTML UI that can be found in the `public/index.html` file.

The parameter values are allocated as seen below once the user clicks on the "Get Followers" or "Get Following" button.
The two queries are very similar and run from two different functions activated from a button on the UI. The first line is used to clear the display before new information is queried.

```javascript
//Followers function
window.submitFollower = async () => {
    //clear list
    document.getElementById('followList').innerHTML = '';
    //get user name
    const username = document.getElementById('username').value;
    //get limit
    var limit = document.getElementById('limit').value;
```

#### 3. Get followers/following<a name="query"></a>

A list of followers or users being followed is called from the database with the `follow_api` available in the `SteemJs` library. Since we are calling a complete list of followers/following we only need the `user` variable and the `limit` which denotes the number of lines the query retrieves with the search always starting at ` `.

```javascript
//get list of followers
    let followlist = await client.call('follow_api', 'get_followers', [
        username,
        '',
        'blog',
        limit,
    ]);

    document.getElementById('followResult').innerHTML = 'Followers'

    //display list of followers in console for control chekc
    console.log('followers: ', followlist);


//get list of authors you are following
    let followlist = await client.call('follow_api', 'get_following', [
        username,
        '',
        'blog',
        limit,
    ]);

    document.getElementById('followResult').innerHTML = 'Following'

    //display list of followers in console for control check
    console.log('following: ', followlist);
```

#### 4. Display<a name="display"></a>

Before the resulting list can be posted to the UI we first have to limit the maximum length of the list to the maximum number of followers/following users. After this a simple while loop is used to populate the list on the UI.

```javascript
    //limit max length
    if (followlist.length < limit) {
        limit = followlist.length;
    }
 
    //display list of followers in UI and console
    var count = 0;
    while (count < limit) {
        followname = followlist[count].follower;
        document.getElementById('followList').innerHTML += followname + '<br>';
        console.log(followname);
        count ++                
    };
```

There is an additional button added to clear the input fields. This is not a necessary step but adds to the ease of use.

```javascript
window.clearFields = function() {
    document.getElementById('username').value = '';
    document.getElementById('list').value = '';
}
```

### To run this tutorial

 1. clone this repo
 2. `cd tutorials/19_get_follower_and_following_list`
 3. `npm i`
 4. `npm run dev-server` or `npm run start`
 5. After a few moments, the server should be running at http://localhost:3000/
