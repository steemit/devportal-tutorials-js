const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

// const dsteem = require('dsteem');
// //define network parameters
// let opts = {};
// opts.addressPrefix = 'STX';
// opts.chainId =
//     '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
// //connect to a steem node, testnet in this case
// const client = new dsteem.Client('https://testnet.steem.vc', opts);

//submit Account search function from html input
const max = 5;
window.searchAcc = async () => {
    const accSearch = document.getElementById('username').value;
    let avail = 'Account is NOT available to register';
    if (accSearch.length > 2) {
        const _account = await client.database.call('get_accounts', [
            [accSearch],
        ]);
        console.log(`_account:`, _account, accSearch.length);

        if (_account.length == 0) {
            avail = 'Account is available to register';
        }
    }
    document.getElementById('accInfo').innerHTML = avail;
};

//create with STEEM function
window.submitTx = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const ownerKey = dsteem.PrivateKey.fromLogin(username, password, 'owner');
    const activeKey = dsteem.PrivateKey.fromLogin(username, password, 'active');
    const postingKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        'posting'
    );
    const memoKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        'memo'
    ).createPublic(opts.addressPrefix);

    const ownerAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
    };
    const activeAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
    };
    const postingAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
    };

    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('wif').value
    );

    const op = [
        'account_create',
        {
            fee: document.getElementById('steem').value,
            creator: document.getElementById('account').value,
            new_account_name: username,
            owner: ownerAuth,
            active: activeAuth,
            posting: postingAuth,
            memo_key: memoKey,
            json_metadata: '',
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

//create with RC function
window.submitDisc = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //create keys
    const ownerKey = dsteem.PrivateKey.fromLogin(username, password, 'owner');
    const activeKey = dsteem.PrivateKey.fromLogin(username, password, 'active');
    const postingKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        'posting'
    );
    const memoKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        'memo'
    ).createPublic(opts.addressPrefix);

    const ownerAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
    };
    const activeAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
    };
    const postingAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
    };

    //private active key of creator account
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('wif').value
    );

    let ops = [];

    //claim discounted account operation
    const creator = document.getElementById('account').value;
    const _account = await client.database.call('get_accounts', [[creator]]);
    console.log(
        'current pending claimed accounts: ' +
            _account[0].pending_claimed_accounts
    );
    if (_account[0].pending_claimed_accounts == 0) {
        const claim_op = [
            'claim_account',
            {
                creator: creator,
                fee: '0.000 STEEM',
                extensions: [],
            },
        ];
        console.log('You have claimed a token');
        ops.push(claim_op);
    }

    //create operation to transmit
    const create_op = [
        'create_claimed_account',
        {
            creator: document.getElementById('account').value,
            new_account_name: username,
            owner: ownerAuth,
            active: activeAuth,
            posting: postingAuth,
            memo_key: memoKey,
            json_metadata: '',
            extensions: [],
        },
    ];
    ops.push(create_op);

    //broadcast operation to blockchain
    client.broadcast.sendOperations(ops, privateKey).then(
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
