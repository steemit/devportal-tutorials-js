# Set withdraw route

_This tutorial is about setting route to your power downs or withdraws. We will learn how to set percent of withdraw to other accounts using Steemconnect as well as with Client-side signing method._

This tutorial runs on the main Steem blockchain. And data is from real accounts with their details.

## Intro

Tutorial will use few functions such as querying account by name and getting account current withdraw routes. And allows you to set withdraw route to other accounts with percent selection and auto power up function. This feature is quite useful if you want to withdraw portion of your STEEM to other account or POWER UP other account as you withdraw from one account.

## Steps

1.  [**App setup**](#app-setup) Setup `dsteem` to use the proper connection and network.
2.  [**Get account routes**](#search-account) Get account's current routes
3.  [**Fill form**](#fill-form) Fill form with appropriate data
4.  [**Set withdraw route**](#withdraw-route) Set route with Steemconnect or Client-side signing

#### 1. App setup <a name="app-setup"></a>

Below we have `dsteem` pointing to the production network with the proper chainId, addressPrefix, and endpoint. There is a `public/app.js` file which holds the Javascript segment of this tutorial. In the first few lines we define the configured library and packages:

```javascript
const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');
```

#### 2. Get account routes <a name="search-account"></a>

After account name field is filled with some name, with `Get withdraw routes` button click we fetch current withdraw routes if exist. HTML input forms can be found in the `index.html` file. The values are pulled from that screen with the below:

```javascript
    const accSearch = document.getElementById('username').value;

    const _account = await client.database.call('get_withdraw_routes', [accSearch]);
    console.log(`_account:`, _account);
```

#### 3. Fill form <a name="fill-form"></a>

After we fetched account data, we will show list of current routes if they exist and note user how many percent they can set to other accounts.

```javascript
let info = '';
let sum = 0;
if (_account.length > 0) {
    for (var i = 0; i < _account.length; i++) {
        info += `${_account[i].to_account} - ${_account[i].percent / 100}%<br>`;
        sum += _account[i].percent / 100;
    }
} else {
    info += `No route is available!<br>`;
}
info += `You can set ${100 - sum}% remaining part to other accounts!`;
document.getElementById('accInfo').innerHTML = info;
```

Percents can be overwritten by changing and submitting transaction again to same account.

We also generate Steemconnect signing link.

```javascript
window.openSC = async () => {
    const link = `https://steemconnect.com/sign/set-withdraw-vesting-route?from_account=${
        document.getElementById('username').value
    }&percent=${document.getElementById('steem').value * 100}&to_account=${
        document.getElementById('account').value
    }&auto_vest=${document.getElementById('percent').checked}`;
    window.open(link);
};
```

#### 4. Set withdraw route <a name="withdraw-route"></a>

We have 2 options on how to set withdraw route others. Steemconnect and Client-side signing options. Since this action requires Active authority, client-side and stemconnect signing asks for Active Private key to sign the transaction. Transaction submission function looks as follows:

```javascript
window.submitTx = async () => {
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('wif').value
    );
    const op = [
        'set_withdraw_vesting_route',
        {
            from_account: document.getElementById('username').value,
            to_account: document.getElementById('account').value,
            percent: document.getElementById('steem').value * 100,
            auto_vest: document.getElementById('percent').checked,
        },
    ];
    client.broadcast.sendOperations([op], privateKey).then(
        function(result) {
            document.getElementById('result').style.display = 'block';
            document.getElementById(
                'result'
            ).innerHTML = `<br/><p>Included in block: ${
                result.block_num
            }</p><br/><br/>`;
        },
        function(error) {
            console.error(error);
        }
    );
};
```

That's it!

### To run this tutorial

1.  clone this repo
1.  `cd tutorials/26_set_withdraw_route`
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at [http://localhost:3000/](http://localhost:3000/)
