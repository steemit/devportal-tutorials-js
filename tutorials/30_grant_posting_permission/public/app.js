import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, testnet in this case
const client = new Client(NetConfig.url, opts);

//check permission status
window.submitCheck = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    //query database for posting array
    var _data = new Array();
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //check for username duplication
    const checkAuth = _data[0].posting.account_auths;
    var arrayindex = -1;
    var checktext = ' does not yet have posting permission';
    for (var i = 0, len = checkAuth.length; i < len; i++) {
        if (checkAuth[i][0] == newAccount) {
            arrayindex = i;
            var checktext = ' already has posting permission';
        }
    }
    document.getElementById('permCheckContainer').style.display = 'flex';
    document.getElementById('permCheck').className =
        'form-control-plaintext alert alert-success';
    document.getElementById('permCheck').innerHTML = newAccount + checktext;
    console.log(checkAuth);
};

//grant permission function
window.submitPermission = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    var _data = new Array();
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //adding of new account to posting array
    postingAuth.account_auths.push([
        newAccount,
        parseInt(postingAuth.weight_threshold),
    ]);
    //sort array required for steem blockchain
    postingAuth.account_auths.sort();

    //object creation
    const accObj = {
        account: username,
        json_metadata: _data[0].json_metadata,
        memo_key: _data[0].memo_key,
        posting: postingAuth,
    };

    //account update broadcast
    client.broadcast.updateAccount(accObj, privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('permCheckContainer').style.display =
                'flex';
            document.getElementById('permCheck').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('permCheck').innerHTML =
                'posting permission has been granted to ' + newAccount;
        },
        function(error) {
            console.error(error);
            document.getElementById('permCheckContainer').style.display =
                'flex';
            document.getElementById('permCheck').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('permCheck').innerHTML = error.jse_shortmsg;
        }
    );
};

//revoke permission function
window.submitRevoke = async () => {
    //get username
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get account to provide posting auth
    const newAccount = document.getElementById('newAccount').value;

    var _data = new Array();
    _data = await client.database.getAccounts([username]);
    const postingAuth = _data[0].posting;

    //check for user index in posting array
    const checkAuth = _data[0].posting.account_auths;
    var arrayindex = -1;
    for (var i = 0, len = checkAuth.length; i < len; i++) {
        if (checkAuth[i][0] == newAccount) {
            arrayindex = i;
        }
    }

    if (arrayindex < 0) {
        document.getElementById('permCheckContainer').style.display = 'flex';
        document.getElementById('permCheck').className =
            'form-control-plaintext alert alert-danger';
        document.getElementById('permCheck').innerHTML =
            newAccount + ' does not yet have posting permission to revoke';
        return;
    }

    //removal of array element in order to revoke posting permission
    postingAuth.account_auths.splice(arrayindex, 1);

    //object creation
    const accObj = {
        account: username,
        json_metadata: _data[0].json_metadata,
        memo_key: _data[0].memo_key,
        posting: postingAuth,
    };

    //account update broadcast
    client.broadcast.updateAccount(accObj, privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('permCheckContainer').style.display =
                'flex';
            document.getElementById('permCheck').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('permCheck').innerHTML =
                'permission has been revoked for ' + newAccount;
        },
        function(error) {
            console.error(error);
            document.getElementById('permCheckContainer').style.display =
                'flex';
            document.getElementById('permCheck').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('permCheck').innerHTML = error.jse_shortmsg;
        }
    );
};

window.onload = async () => {
    const account = NetConfig.accounts[0];
    const accountI = NetConfig.accounts[1];
    document.getElementById('username').value = account.address;
    document.getElementById('privateKey').value = account.privActive;
    document.getElementById('newAccount').value = accountI.address;
};
