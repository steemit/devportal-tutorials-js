//Step 1.

// const dsteem = require('dsteem');
// //define network parameters
// let opts = {};
// opts.addressPrefix = 'STX';
// opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
// //connect to a steem node, testnet in this case
// const client = new dsteem.Client('https://testnet.steem.vc', opts);

const dsteem = require('dsteem');
let opts = {};
//define network parameters
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to a steem node, production in this case
const client = new dsteem.Client('https://api.steemit.com');


//Step 2. user fills in the values for 'username' and 'limit'

//Followers function
window.submitFollower = async () => {
    //clear list
    document.getElementById('followList').innerHTML = '';
    
    //get user name
    const username = document.getElementById('username').value;
    //get limit
    var limit = document.getElementById('limit').value;

//Step 3. Call followers list

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

//Step 4. Limit maximum length and display results on UI

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
};

//Step 2. user fills in the values for 'username' and 'limit'

//Following function
window.submitFollowing = async () => {
    //clear list
    document.getElementById('followList').innerHTML = '';
    
    //get user name
    const username = document.getElementById('username').value;
    //get limit
    var limit = document.getElementById('limit').value;

//Step 3. Call following list

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

//Step 4. Limit maximum length and display results on UI

    //limit max length
    if (followlist.length < limit) {
        limit = followlist.length;
    };

    //display list of following in UI and console
    var count = 0;
    while (count < limit) {
        followname = followlist[count].following;
        document.getElementById('followList').innerHTML += followname + '<br>';
        console.log(followname);
        count ++
    };
};

//additional button added to clear fields
window.clearFields = function() {
    document.getElementById('username').value = '';
    document.getElementById('list').value = '';
};
