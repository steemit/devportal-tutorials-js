# Transfer STEEM and SBD to savings

_How to transfer STEEM and SBD to your savings account_

This tutorial will take you through the process of checking a specific users' STEEM, SBD and savings balances and then broadcasting the intended transfer or withdrawal to the blockchain. Demo account information has been provided to assist with the tutorial. This tutorial has been set up for the `testnet` but can be easily be changed to `production`.

It should be noted that when funds are being withdrawn from the savings account it takes 3 days for those funds to reflect in the available STEEM/SBD balance. The withdrawal can be cancelled at any point during this waiting period. This measure was put in place to reduce the risk of funds being stolen when accounts are hacked as it gives sufficient time to recover your account before your funds are transferred out. Storing your funds in your savings account is thus more secure than having them as available balances.

Steemconnect offers an alternative to transferring STEEM and SBD with a "simple link" solution. Instead of running through a list of operations on your account, you can simply use a link similar to the one below substituting the four parameters with your own details. You will be prompted to enter your username and password before the transaction will be executed.
https://steemconnect.com/sign/transfer-to-savings?from=username&to=username&amount=0.000%20STEEM&memo=text
This is similar to the steemconnect links that have been covered in previous tutorials. For a list of signing operations that work in this manner you can go to https://v2.steemconnect.com/sign. There is also a steemconnect link for withdrawing funds.

## Intro

This tutorial uses the `database API` to gather account information for the current SBD, STEEM and savings balances of the specified user. This information is then used to assist the user in completing the transfer and withdrawal request. The values are then captured and the operation is transmitted via the `broadcast` API. The parameters for the two function are:

`transfer_to_savings`

1.  _from_ - Account where the funds are being transferred from
1.  _to_ - Account where the funds are being transferred to
1.  _amount_ - The amount of funds being transferred
1.  _memo_ - This is an optional text field which can be used for a comment on the transfer

`transfer_from_savings`

1.  _from_ - Account where the savings are being withdrawn from
1.  _to_ - Account where the savings are being withdrawn to
1.  _request id_ - Integer identifier for tracking the withdrawal. This needs to be a unique number for a specified user
1.  _amount_ - The amount of funds being withdrawn
1.  _memo_ - This is an optional text field which can be used for a comment on the withdrawal

The only other information required is the private active key of the user.

## Steps

1.  [**Configure connection**](#connection) Configuration of `dsteem` to communicate with a Steem blockchain
1.  [**User account**](#user) User account is captured and balances displayed
1.  [**Input variables**](#input) Collecting the required inputs via an HTML UI
1.  [**Broadcast operation**](#broadcast) Broadcasting the operation to the blockchain

#### 1. Configure connection<a name="connection"></a>

As usual, we have a `public/app.js` file which holds the Javascript segment of the tutorial. In the first few lines we define the configured library and packages:

```javascript
import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

// //connect to a steem node, tesetnet in this case
const client = new Client(NetConfig.url, opts);
```

Above, we have `dsteem` pointing to the testnet with the proper chainId, addressPrefix, and endpoint by importing it from the `configuration.js` file. Due to this tutorial altering the blockchain it is preferable to not work on production.

#### 2. User account<a name="user"></a>

The user account is input through the UI. Once entered, the user can select the `search` button to display the balances for that account. For ease of use values for a demo account has already been entered in the relevant fields once the page loads.

```javascript
window.onload = async () => {
    const account = NetConfig.accounts[0];
    document.getElementById('username').value = account.address;
    document.getElementById('privateKey').value = account.privActive;
};
```

With the account search function as seen below.

```javascript
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
```

#### 3. Input variables<a name="input"></a>

The parameters for both the `transfer` and `withdraw` functions are input in the UI and assigned as seen below once the user presses the relevant button.

```javascript
//get all values from the UI for funds transfer
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
```

```javascript
//get all values from the UI for withdraw
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
```

A random number is also generated for the `requestid` during this step. This value needs to be unique for the specific account. If the requestid is duplicated an error to do with "uniqueness constraint" will be displayed in the console.

#### 4. Broadcast operation<a name="broadcast"></a>

With all the parameters assigned we create an array for the `transfer` and `withdraw` function and transmit it to the blockchain via the `sendOperation` function in the `broadcast` API.

```javascript
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
```

```javascript
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
    
//broadcast the withdrawal
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
```

The results of the operation are displayed on the UI along with a block number in the console to confirm a successful operation.

### To run this tutorial

1.  clone this repo
1.  `cd tutorials/33_transfer_steem_and_sbd_to_savings`
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at http://localhost:3000/