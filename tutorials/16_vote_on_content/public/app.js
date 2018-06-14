const dsteem = require('dsteem');

//define network parameters
let opts = {};
opts.addressPrefix = 'STX';
opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to a steem node, testnet in this case
const client = new dsteem.Client('https://testnet.steem.vc', opts);


//User fills in the values for 'author' and 'post_permlink' and selects the 'weight' of the vote via the slider


//submit vote function executes when you click "Submit Vote" button
window.submitVote = async () => {
    
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
    const weight = parseInt(document.getElementById('currentWeight').innerHTML, 10);
    
    //create vote object
    const vote = new Object();
      vote.voter = voter;
      vote.author = author;
      vote.permlink = permlink;
      vote.weight = weight; //needs to be an integer for the vote function

    //broadcast the vote

    client.broadcast.vote(vote, privateKey); 

};

//function used to clear the populated fields
window.clearFields = function() {
    document.getElementById('author').value = '';
    document.getElementById('permlink').value = '';
}