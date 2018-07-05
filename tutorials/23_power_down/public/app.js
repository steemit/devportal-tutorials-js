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
    const avail =
        parseFloat(_account[0].vesting_shares) -
        (parseFloat(_account[0].to_withdraw) -
            parseFloat(_account[0].withdrawn)) /
            1e6 -
        parseFloat(_account[0].delegated_vesting_shares);

    const props = await client.database.getDynamicGlobalProperties();
    const vestSteem = parseFloat(
        parseFloat(props.total_vesting_fund_steem) *
            (parseFloat(avail) / parseFloat(props.total_vesting_shares)),
        6
    );

    const balance = `Available Vests for ${name}: ${avail} VESTS ~ ${vestSteem} STEEM POWER<br/><br/>`;
    document.getElementById('accBalance').innerHTML = balance;
    document.getElementById('steem').value = avail + ' VESTS';

    document.getElementById('sc').style.display = 'block';
    const link = `https://steemconnect.com/sign/withdraw-vesting?account=${name}&vesting_shares=${
        document.getElementById('steem').value
    }`;
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
        const link = `https://steemconnect.com/sign/withdraw-vesting?account=${
            document.getElementById('username').value
        }&vesting_shares=${document.getElementById('steem').value}`;
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
        'withdraw_vesting',
        {
            account: document.getElementById('username').value,
            vesting_shares: document.getElementById('steem').value,
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
