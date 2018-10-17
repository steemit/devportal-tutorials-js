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

    const _accounts = await client.database.call('get_accounts', [[accSearch]]);
    console.log(`_accounts:`, _accounts);
    const name = _accounts[0].name;
    const reward_steem = _accounts[0].reward_steem_balance.split(' ')[0];
    const reward_sbd = _accounts[0].reward_sbd_balance.split(' ')[0];
    const reward_sp = _accounts[0].reward_vesting_steem.split(' ')[0];
    const reward_vests = _accounts[0].reward_vesting_balance.split(' ')[0];
    const unclaimed_balance = `Unclaimed balance for ${name}: ${reward_steem} STEEM, ${reward_sbd} SBD, ${reward_sp} SP = ${reward_vests} VESTS<br/>`;
    document.getElementById('accList').innerHTML = unclaimed_balance;
    document.getElementById('steem').value = reward_steem;
    document.getElementById('sbd').value = reward_sbd;
    document.getElementById('sp').value = reward_vests;

    document.getElementById('sc').style.display = 'block';
    const link = `https://steemconnect.com/sign/claim-reward-balance?account=${name}&reward_steem=${reward_steem}&reward_sbd=${reward_sbd}&reward_vests=${reward_vests}`;
    document.getElementById(
        'sc'
    ).innerHTML = `<br/><a href=${link} target="_blank">Steemconnect signing</a>`;
};

window.submitTx = async () => {
    const privateKey = PrivateKey.fromString(
        document.getElementById('wif').value
    );
    const op = [
        'claim_reward_balance',
        {
            account: document.getElementById('username').value,
            reward_steem: document.getElementById('steem').value + ' STEEM',
            reward_sbd: document.getElementById('sbd').value + ' SBD',
            reward_vests: document.getElementById('sp').value + ' VESTS',
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
