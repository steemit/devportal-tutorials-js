const dsteem = require('dsteem');
//define network parameters
let opts = {};
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
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
    const title = 'New Blog';
    //get body
    const body = 'This is my new test blog';
    //get tags and convert to array list
    const tags = 'blog';
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
                document.getElementById(
                    'postLink'
                ).innerHTML = `Included in block: <a href="http://condenser.steem.vc/${
                    taglist[0]
                }/@${account}/${permlink}" target="_blank">${
                    result.block_num
                }</a>`;
                document.getElementById('postResult').style.display = 'flex';
                document.getElementById('permlink').value = permlink;
            },
            function(error) {
                console.error(error);
            }
        );
};

//submit vote function executes when you click "Submit Vote" button
window.submitVote = async () => {
    document.getElementById('voteResult').innerHTML = 'pending...';
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
    const permlink = document.getElementById('permlink').value;
    //get weight of vote
    const weight = parseInt(
        document.getElementById('currentWeight').innerHTML,
        10
    );

    //create vote object
    const vote = new Object();
    vote.voter = voter;
    vote.author = author;
    vote.permlink = permlink;
    vote.weight = weight; //needs to be an integer for the vote function

    //broadcast the vote

    client.broadcast.vote(vote, privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('voteResultContainer').style.display =
                'flex';
            document.getElementById('voteResult').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('voteResult').innerHTML = 'Success';
        },
        function(error) {
            console.error(error);
            document.getElementById('voteResultContainer').style.display =
                'flex';
            document.getElementById('voteResult').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('voteResult').innerHTML =
                error.jse_shortmsg;
        }
    );
};

window.onload = () => {
    var voteWeightSlider = document.getElementById('voteWeight');
    var currentWeightDiv = document.getElementById('currentWeight');
    currentWeightDiv.innerHTML = voteWeightSlider.value;
    voteWeightSlider.oninput = function() {
        currentWeightDiv.innerHTML = this.value;
    };
};
