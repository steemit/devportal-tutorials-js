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
        console.log('witness : ', witness);
        witnesses.push(
            `<li><a href="#" onclick="document.getElementById('witness').value = '${witness}';">${witness}</a></li>`
        );
    }
    document.getElementById('witnessList').innerHTML = witnesses.join('');
    document.getElementById('witnessListContainer').style.display = 'flex';
};

//submit vote function executes when you click "Submit Vote" button
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

    //check if witness is already voted for
    _data = new Array
    _data = await client.database.getAccounts([voter]);
    const witnessvotes = _data[0]["witness_votes"];
    const approve = witnessvotes.includes(witness);
    if (approve) {
        checkresult = "Witness has already been voted for, would you like to remove vote?"
        votecheck = "Vote removed"
    } else {
        checkresult = "Witness has not yet been voted for, would you like to vote?"
        votecheck = "Vote added"
    }
    
    document.getElementById('voteCheckContainer').style.display = 'flex';
    document.getElementById('voteCheck').className = 'form-control-plaintext alert alert-success';
    document.getElementById('voteCheck').innerHTML = checkresult;

    document.getElementById("submitYesBtn").style.visibility = "visible";
    document.getElementById("submitNoBtn").style.visibility = "visible";

    window.submitYes = async () => {
        //create vote object
        const vote = [
        'account_witness_vote',
        { account: voter, witness: witness, approve: !approve },
        ];

        //broadcast the vote
        client.broadcast.sendOperations([vote], privateKey).then(
            function(result) {
                console.log(
                    'included in block: ' + result.block_num,
                    'expired: ' + result.expired
                );
                document.getElementById('voteCheckContainer').style.display =
                    'flex';
                document.getElementById('voteCheck').className =
                    'form-control-plaintext alert alert-success';
                document.getElementById('voteCheck').innerHTML = votecheck;
            },
            function(error) {
                console.error(error);
                document.getElementById('voteCheckContainer').style.display =
                    'flex';
                document.getElementById('voteCheck').className =
                    'form-control-plaintext alert alert-danger';
                document.getElementById('voteCheck').innerHTML =
                    error.jse_shortmsg;
            }
        );
        document.getElementById("submitYesBtn").style.visibility = "hidden";
        document.getElementById("submitNoBtn").style.visibility = "hidden";
    };

    window.submitNo = async () => {
        document.getElementById('voteCheckContainer').style.display =
            'flex';
        document.getElementById('voteCheck').className =
            'form-control-plaintext alert alert-success';
        document.getElementById('voteCheck').innerHTML = "Vote process has ben cancelled";
        document.getElementById("submitYesBtn").style.visibility = "hidden";
        document.getElementById("submitNoBtn").style.visibility = "hidden";
    };

};