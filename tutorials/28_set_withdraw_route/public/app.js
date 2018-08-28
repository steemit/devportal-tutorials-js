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
window.submitAcc = async () => {
    const accSearch = document.getElementById('username').value;

    const _account = await client.database.call('get_withdraw_routes', [
        accSearch,
    ]);
    console.log(`_account:`, _account);
    let info = '';
    let sum = 0;
    if (_account.length > 0) {
        for (var i = 0; i < _account.length; i++) {
            info += `${_account[i].to_account} - ${_account[i].percent /
                100}%<br>`;
            sum += _account[i].percent / 100;
        }
    } else {
        info += `No route is available!<br>`;
    }
    info += `You can set ${100 - sum}% remaining part to other accounts!`;
    document.getElementById('accInfo').innerHTML = info;
};
window.openSC = async () => {
    const link = `https://steemconnect.com/sign/set-withdraw-vesting-route?from_account=${
        document.getElementById('username').value
    }&percent=${document.getElementById('steem').value * 100}&to_account=${
        document.getElementById('account').value
    }&auto_vest=${document.getElementById('percent').checked}`;
    window.open(link);
};
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
