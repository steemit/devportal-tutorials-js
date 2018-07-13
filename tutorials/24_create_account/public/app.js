const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

//submitAcc function from html input
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
    const memoKey = dsteem.PrivateKey.fromLogin(username, password, 'memo');

    const ownerAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[ownerKey.createPublic(), 1]],
    };
    const activeAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[activeKey.createPublic(), 1]],
    };
    const postingAuth = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[postingKey.createPublic(), 1]],
    };

    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('wif').value
    );
    const op = [
        'account_create',
        {
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
