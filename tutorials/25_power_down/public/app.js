import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };
//connect to a steem node, testnet in this case
const client = new Client(NetConfig.url, opts);

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
    )} target="_blank">Steemconnect signing</a>`;
};

window.submitTx = async () => {
    const privateKey = PrivateKey.fromString(
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
