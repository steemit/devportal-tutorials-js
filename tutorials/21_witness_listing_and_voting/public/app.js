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

//create witness list function
window.createList = async () => {
    //get list limit
    const limit = document.getElementById('limit').value;

    const witnessdata = await client.database.getState('witnesses');
    var witnesses = [];

    for (const witness in witnessdata.witnesses) {
        console.log('witness', witness);
        witnesses.push(
            `<li><a href="#" onclick="document.getElementById('witness').value = '${witness}';">${witness}</a></li>`
        );
    }
    console.log('witnesses', witnesses);
    document.getElementById('witnessList').innerHTML = witnesses.join('');
    document.getElementById('witnessListContainer').style.display = 'flex';
};

//submit vote function executes when you click "Submit Vote" button

//broadcast
//["account_witness_vote", {account: "lightforge13", witness: "jacor-witness", approve: true}]

// steem.broadcast.accountWitnessVote(wif, account, witness, approve, function(err, result) {
//     console.log(err, result);
//   });

window.submitVote = async () => {
    //get all values from the UI
    //get account name of voter
    const voter = document.getElementById('username').value;
    //get private active key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('activeKey').value
    );
    //get witness name
    const witness = document.getElementById('witness').value;

    //create vote object
    const vote = [
        'account_witness_vote',
        { account: voter, witness: witness, approve: true },
    ];

    //broadcast the vote

    client.broadcast.sendOperations([vote], privateKey).then(
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
