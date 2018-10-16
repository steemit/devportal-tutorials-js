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

    const balance = `Available balance: ${availSBD} and ${availSTEEM} <br/>`;
    document.getElementById('accBalance').innerHTML = balance;

    //create random number for requestid paramter
    var x = Math.floor(Math.random() * 10000000);
    document.getElementById("requestID").value = x
}

//submit convert function executes when you click "Convert" button
window.submitConvert = async () => {
    //get all values from the UI
    //get account name
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get convert amount
    const quantity = document.getElementById('quantity').value;
    //create correct format
    const convert = quantity.concat(' SBD');
    //assign integer value of ID
    const requestid = parseInt(document.getElementById('requestID').value);

    //create convert operation
    const op = [
        'convert',
        { owner: username, amount: convert, requestid: requestid },
    ];
    
    //broadcast the conversion
    client.broadcast.sendOperations([op], privateKey).then(
        function(result) {
            console.log(
                'included in block: ' + result.block_num,
                'expired: ' + result.expired
            );
            document.getElementById('convertResultContainer').style.display =
                'flex';
            document.getElementById('convertResult').className =
                'form-control-plaintext alert alert-success';
            document.getElementById('convertResult').innerHTML = 'Success';
        },
        function(error) {
            console.error(error);
            document.getElementById('convertResultContainer').style.display =
                'flex';
            document.getElementById('convertResult').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('convertResult').innerHTML =
                error.jse_shortmsg;
        }
    );
};

window.onload = async () => {
    const account = NetConfig.accounts[0];
    document.getElementById('username').value = account.address;
    document.getElementById('privateKey').value = account.privActive;
};
