import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, testnet in this case
const client = new Client(NetConfig.url, opts);

const createPrivateKey = function() {
    try {
        return PrivateKey.fromString(
            document.getElementById('postingKey').value
        );
    } catch (e) {
        const resultEl = document.getElementById('result');
        resultEl.className = 'form-control-plaintext alert alert-danger';
        resultEl.innerHTML = e.message + ' - See console for full error.';
        throw e;
    }
};

//refer to "10_submit_post" in the tutorials folder for creating a post on steemit
window.createPost = async () => {
    //get private key
    const privateKey = createPrivateKey();
    //get account name
    const account = document.getElementById('username').value;
    //for content
    const time = new Date().getTime();
    //get title
    const title = `developers.steem.io - JS-T:17 ${time}`;
    //get body
    const body = `Go to [developers.steem.io](https://developers.steem.io) for the latest in Steem tutorials! This post was created by someone using the active version of those tutorials at  [https://github.com/steemit/devportal-tutorials-js](https://github.com/steemit/devportal-tutorials-js)
        
        ${time}`;
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
    //we'll make use of resultEl in multiple child scopes. This is generally good practice.
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = 'pending...';

    //get all values from the UI//
    //get account name of voter
    const voter = document.getElementById('username').value;
    //get private posting key
    const privateKey = createPrivateKey();
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
    const vote = {
        voter,
        author,
        permlink,
        weight, //needs to be an integer for the vote function
    };

    //broadcast the vote
    client.broadcast.vote(vote, privateKey).then(
        function(result) {
            console.log('success:', result);
            resultEl.className = 'form-control-plaintext alert alert-success';
            resultEl.innerHTML = 'Success! See console for full response.';
        },
        function(error) {
            console.log('error:', error);
            resultEl.className = 'form-control-plaintext alert alert-danger';
            resultEl.innerHTML =
                error.jse_shortmsg + ' - See console for full response.';
        }
    );
};

window.onload = async () => {
    var voteWeightSlider = document.getElementById('voteWeight');
    var currentWeightDiv = document.getElementById('currentWeight');
    currentWeightDiv.innerHTML = voteWeightSlider.value;
    voteWeightSlider.oninput = function() {
        currentWeightDiv.innerHTML = this.value;
    };
    const account = NetConfig.accounts[0];
    document.getElementById('username').value = account.address;
    document.getElementById('postingKey').value = account.privPosting;
};
