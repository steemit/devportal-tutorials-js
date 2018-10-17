import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, tesetnet in this case
const client = new Client(NetConfig.url, opts);


window.submitAcc = async () => {
    const accSearch = document.getElementById('username').value;

    const _account = await client.database.call('get_accounts', [[accSearch]]);
    console.log(`_account:`, _account);

    const availSBD = _account[0].sbd_balance 
    const availSTEEM = _account[0].balance

    const balance = `Available balance: ${availSBD} and ${availSTEEM}`;
    document.getElementById('accBalance').innerHTML = balance;

    const saveSBD = _account[0].savings_sbd_balance
    const saveSTEEM = _account[0].savings_balance

    const savings = `Savings balance: ${saveSBD} and ${saveSTEEM} <br/>`;
    document.getElementById('savingsBalance').innerHTML = savings;

}

window.submitTransfer = async () => {
    //get all values from the UI
    //get account name
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get convert amount
    const quantity = document.getElementById('quantity').value;
    //assign integer value of ID
    const type = document.getElementById('type').value;
    //create correct format
    const _transfer = quantity.concat(' ', type);


    //create transfer operation
    const op = [
        'transfer_to_savings', {
            from: username,
            to: username,
            amount: _transfer,
            memo: ''
        }
    ];
    
    //broadcast the transfer
    client.broadcast.sendOperations([op], privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('transferResultContainer').style.display =
                'flex';
            document.getElementById('transferResult').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('transferResult').innerHTML = 'Success';
        },
        function(error) {
            console.error(error);
            document.getElementById('transferResultContainer').style.display =
                'flex';
            document.getElementById('transferResult').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('transferResult').innerHTML =
                error.jse_shortmsg;
        }
    );
};

window.submitWithdraw = async () => {
    //get all values from the UI
    //get account name
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get convert amount
    const quantity = document.getElementById('quantity').value;
    //assign integer value of ID
    const type = document.getElementById('type').value;
    //create correct format
    const _transfer = quantity.concat(' ', type);

    //create random number for requestid paramter
    var x = Math.floor(Math.random() * 10000000);
    var requestId = parseInt(x)


    //create withdraw operation
    const op = [
        'transfer_from_savings', {
            from: username,
            to: username,
            request_id: requestId,
            amount: _transfer,
            memo: ''
        }
    ];
    
    //broadcast the withdraw
    client.broadcast.sendOperations([op], privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('transferResultContainer').style.display =
                'flex';
            document.getElementById('transferResult').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('transferResult').innerHTML = 'Success. Transaction ID: ' + requestId;
        },
        function(error) {
            console.error(error);
            document.getElementById('transferResultContainer').style.display =
                'flex';
            document.getElementById('transferResult').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('transferResult').innerHTML =
                error.jse_shortmsg;
        }
    );
};

window.onload = async () => {
    const account = NetConfig.accounts[0];
    document.getElementById('username').value = account.address;
    document.getElementById('privateKey').value = account.privActive;
};
