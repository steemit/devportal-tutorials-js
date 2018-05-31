const dsteem = require('dsteem');

//define network parameters
let opts = {};
opts.addressPrefix = 'STM';
opts.chainId = '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://api.steemit.com', opts);

//this function will execute when the HTML form is submitted
window.submitPost = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const myAccount = document.getElementById('username').value;
    //get blog author
    const theAuthor = document.getElementById('theAuthor').value;
    //get blog permLink
    const thePermLink = document.getElementById('thePost').value;

    const jsonOp = JSON.stringify(['reblog', {
        account: myAccount,
        author: theAuthor,
        permlink: thePermLink
    }]);

    const data = {
        id: 'follow',
        json: jsonOp,
        required_auths: [],
        required_posting_auths: [myAccount]
    }

    client.broadcast.json(data, privateKey)
        .then(
            function (result) {
                console.log('client broadcast result: ', result);
            },
            function (error) {
                console.error(error);
            }
        );

    

};