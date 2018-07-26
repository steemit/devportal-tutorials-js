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

//check permission status
window.submitCheck = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    //query database for posting array
    _data = new Array
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //check for username duplication
    const checkAuth = _data[0].posting.account_auths;
    var arrayindex = -1;
    for (var i = 0,len = checkAuth.length; i<len; i++) {
        if (checkAuth[i][0]==newAccount) {
            arrayindex = i
            var checktext = "User already has posting permission"
        } else {
            var checktext = "User does not yet have posting permission"
        }
    }
    document.getElementById('permCheckContainer').style.display = 'flex';
    document.getElementById('permCheck').className = 'form-control-plaintext alert alert-success';
    document.getElementById('permCheck').innerHTML = checktext;
}

//grant permission function
window.submitPermission = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    _data = new Array
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //adding of new account to posting array
    postingAuth.account_auths.push([newAccount, parseInt(postingAuth.weight_threshold)]);
    
    //object creation
    const accObj = {
        account: username,
        json_metadata: _data[0].json_metadata,
        memo_key: _data[0].memo_key,
        posting: postingAuth,
    }
    
    //account update broadcast
    client.broadcast.updateAccount(accObj, privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('permCheckContainer').style.display = 'flex';
            document.getElementById('permCheck').className = 'form-control-plaintext alert alert-success';
            document.getElementById('permCheck').innerHTML = "permission has been granted";
        },
        function(error) {
            console.error(error);
            document.getElementById('permCheckContainer').style.display = 'flex';
            document.getElementById('permCheck').className = 'form-control-plaintext alert alert-danger';
            document.getElementById('permCheck').innerHTML = error.jse_shortmsg;
        }
    );
}

//revoke permission function
window.submitRevoke = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    _data = new Array
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //check for user index in posting array
    const checkAuth = _data[0].posting.account_auths;
    var arrayindex = -1;
    for (var i = 0,len = checkAuth.length; i<len; i++) {
        if (checkAuth[i][0]==newAccount) {
            arrayindex = i
        }
    }    

    if (arrayindex = -1) {
        document.getElementById('permCheckContainer').style.display = 'flex';
        document.getElementById('permCheck').className = 'form-control-plaintext alert alert-danger';
        document.getElementById('permCheck').innerHTML = "ERROR! User does not yet have permission and revoking the access will remove the next available user";
        return;
    }

    //removal of array element in order to revoke posting permission
    postingAuth.account_auths.splice(arrayindex,1);

    //object creation
    const accObj = {
        account: username,
        json_metadata: _data[0].json_metadata,
        memo_key: _data[0].memo_key,
        posting: postingAuth,
    }

    //account update broadcast
    client.broadcast.updateAccount(accObj, privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('permCheckContainer').style.display = 'flex';
            document.getElementById('permCheck').className = 'form-control-plaintext alert alert-success';
            document.getElementById('permCheck').innerHTML = "permission has been revoked";
        },
        function(error) {
            console.error(error);
            document.getElementById('permCheckContainer').style.display = 'flex';
            document.getElementById('permCheck').className = 'form-control-plaintext alert alert-danger';
            document.getElementById('permCheck').innerHTML = error.jse_shortmsg;
        }
    );
};