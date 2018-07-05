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

    const _account = await client.database.call('get_accounts', [[accSearch]]);
    console.log(`_account:`, _account);
    const name = _account[0].name;
    const steem_balance = _account[0].balance;
    const balance = `Available Steem balance for ${name}: ${steem_balance}<br/>`;
    document.getElementById('accBalance').innerHTML = balance;
    document.getElementById('steem').value = steem_balance;
    const receiver = document.getElementById('receiver').value;

    document.getElementById('sc').style.display = 'block';
    const link = `https://steemconnect.com/sign/transfer-to-vesting?from=${name}&to=${receiver}&amount=${steem_balance}`;
    document.getElementById('sc').innerHTML = `<br/><a href=${encodeURI(
        link
    )}>Steemconnect signing</a>`;
};
window.sc = async () => {
    const sc = document.getElementById('check').checked;
    console.log(sc);
    if (sc) {
        document.getElementById('client').style.display = 'block';
        document.getElementById('sc').style.display = 'none';
    } else {
        document.getElementById('sc').style.display = 'block';
        const link = `https://steemconnect.com/sign/transfer-to-vesting?from=${
            document.getElementById('username').value
        }&to=${document.getElementById('receiver').value}&amount=${
            document.getElementById('steem').value
        }`;
        document.getElementById('sc').innerHTML = `<br/><a href=${encodeURI(
            link
        )}>Steemconnect signing</a>`;

        document.getElementById('client').style.display = 'none';
    }
};
window.submitTx = async () => {
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('wif').value
    );
    const op = [
        'transfer_to_vesting',
        {
            from: document.getElementById('username').value,
            to: document.getElementById('receiver').value,
            amount: document.getElementById('steem').value,
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
