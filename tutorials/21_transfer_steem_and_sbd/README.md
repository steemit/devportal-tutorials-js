# Transfer STEEM and SBD

_Transfer both STEEM and SBD from one account to another._

This tutorial will take you through the process of preparing and submitting a `transfer` using the `broadcast` operation. Two demo accounts are provided to use on the `testnet` but all variables can be easily changed and applied to the `production server`.

There is also an alternative method to transfer from one account to another using a `hot signing` link that can be generated via [Steemconnect](https://steemconnect.com/sign/). You create a link using the `to` account, the amount, and a `memo` (optional comments). This [link](https://steemconnect.com/sign/transfer?to=steemitblog&amount=1.000%20STEEM) then allows you to do a transfer simply by adding the login details of the `from` account. This is a very simple way to send a payment request to any other user with the correct details already provided by the link.

## Intro

We are using the `broadcast.transfer` function provided by the `dsteem` library to send the transaction through to the network. In order to do the transfer, two accounts are required. One the sender and the other the recipient. You also can't transfer from and to the same account, which is why two accounts have been provided for this tutorial. There are 6 parameters required for the transfer operation:

1.  _Username_ - The username of the account making the transfer (`from` account)
1.  _Privatekey_ - This is the private `active` key of the sender
1.  _Recipient_ - The account that is receiving the STEEM or SBD (`to` account)
1.  _Memo_ - This is a text field which can be used for a comment on the transfer or it can be left empty
1.  _Amount_ - This is the amount of STEEM to transfer. This has to be a positive value with 3 decimals in order for the transaction to be completed
1.  _Type_ - This is the currency of the transfer, STEEM or SBD. This value has to be written ALL CAPS in order for the transaction to be completed

It is noteworthy that Steem Power (VESTS) cannot be transferred with this operation.

## Steps

1.  [**Configure connection**](#connection) Configuration of `dsteem` to communicate with a Steem blockchain
1.  [**Input variables**](#input) Collecting the required inputs via an HTML UI
1.  [**Object creation**](#object) Creating an object to use in the broadcast operation
1.  [**Broadcast**](#broadcast) Broadcasting the transfer to the blockchain

#### 1. Configure connection<a name="connection"></a>

As usual, we have a `public/app.js` file which holds the Javascript segment of the tutorial. In the first few lines we define the configured library and packages:

```javascript
import { Client, PrivateKey } from 'dsteem';
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

// //connect to a steem node, tesetnet in this case
const client = new Client(NetConfig.url, opts);
```

Above, we have `dsteem` pointing to the test network with the proper chainId, addressPrefix, and endpoint by importing from the `configuration.js` file. Because this tutorial is interactive, we will not publish test content to the main network. Instead, we're using the testnet and a predefined account which is imported once the application loads, to demonstrate funds transfers.

```javascript
window.onload = async () => {
    const account = NetConfig.accounts[0];
    const accountI = NetConfig.accounts[1];
    document.getElementById('username').value = account.address;
    document.getElementById('privateKey').value = account.privActive;
    document.getElementById('recipient').value = accountI.address;
};
```

#### 2. Input variables<a name="input"></a>

The required parameters for the transfer operation is recorded via an HTML UI that can be found in the `public/index.html` file. The values are prepopulated in this case with testnet `demo` accounts. The transfer amount is set to `1.000` but any value can be input as long as the sender has enough STEEM to send.

The parameter values are allocated as seen below, once the user clicks on the "Transfer" button.

```javascript
window.submitTransfer = async () => {
    //get all values from the UI
    //get account name of sender
    const username = document.getElementById('username').value;
    //get private active key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('privateKey').value
    );
    //get recipient
    const recipient = document.getElementById('recipient').value;
    //get comments
    const comments = document.getElementById('comments').value;
    //get transfer amount
    const quantity = document.getElementById('quantity').value;
    //get transfer type
    const type = document.getElementById('type').value;
```

#### 3. Object creation<a name="object"></a>

In the `broadcast.transfer` operation, the `amount` parameter is a combination of the transfer `value` and `type` which is why we concatenate the two values into a single variable. We then create a `transfer object` with the input variables to use within the broadcast operation.

```javascript
const transfer = quantity.concat(' ', type);

//create transfer object
const transf = new Object();
transf.from = username;
transf.to = recipient;
transf.amount = transfer;
transf.memo = comments;
```

#### 4. Broadcast<a name="broadcast"></a>

We can complete the `broadcast` operation using the created object and the private active key received from the input UI. The result of the transfer is displayed on the UI to confirm whether it was a success or an error occurred. The result is also displayed in the console with the relevant block number or transfer error.

```javascript
client.broadcast.transfer(transf, privateKey).then(
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

### To run this tutorial

1.  clone this repo
1.  `cd tutorials/21_transfer_STEEM_and_SBD`
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at [http://localhost:3000/](http://localhost:3000/)
