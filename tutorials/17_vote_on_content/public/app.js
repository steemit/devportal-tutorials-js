const dsteem = require('dsteem');
//define network parameters
let opts = {};
opts.addressPrefix = 'STX';
opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to a steem node, testnet in this case
const client = new dsteem.Client('https://testnet.steem.vc', opts);


// const dsteem = require('dsteem');
// let opts = {};
// //define network parameters
// opts.addressPrefix = 'STM';
// opts.chainId =
//     '0000000000000000000000000000000000000000000000000000000000000000';
// //connect to a steem node, production in this case
// const client = new dsteem.Client('https://api.steemit.com');


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




//submit vote function executes when you click "Submit Vote" button
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
    
    //create vote object
    const vote = new Object();
      vote.voter = voter;
      vote.author = author;
      vote.permlink = permlink;
      vote.weight = weight; //needs to be an integer for the vote function

    //broadcast the vote

    client.broadcast.vote(vote, privateKey).then(function(result){
        console.log('included in block: ' + result.block_num, 'expired: ' + result.expired)
        document.getElementById('voteResult').innerHTML = 'Success'
    }, function(error) {
        console.error(error)
        document.getElementById('voteResult').innerHTML = 'Failed'
    })

};