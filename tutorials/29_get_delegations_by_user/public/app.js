// const dsteem = require('dsteem');
// //define network parameters
// let opts = {};
// opts.addressPrefix = 'STX';
// opts.chainId =
//     '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
// //connect to a steem node, testnet in this case
// const client = new dsteem.Client('https://testnet.steem.vc', opts);

const dsteem = require('dsteem');
let opts = {};
//define network parameters
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to a steem node, production in this case
const client = new dsteem.Client('https://api.steemit.com');

//active delegations function
window.createList = async () => {
    //clear list
    document.getElementById('delegationList').innerHTML = '';

    //get username
    const delegator = document.getElementById('username').value;

    //account, from, limit
    delegationdata = await client.database.getVestingDelegations(
        delegator,
        '',
        100
    );
    console.log(JSON.stringify(delegationdata));

    if (delegationdata[0] == null) {
        console.log('No delegation information');
        document.getElementById('searchResultContainer').style.display = 'flex';
        document.getElementById('searchResult').className =
            'form-control-plaintext alert alert-danger';
        document.getElementById('searchResult').innerHTML =
            'No delegation information';
    } else {
        document.getElementById('searchResultContainer').style.display = 'flex';
        document.getElementById('searchResult').className =
            'form-control-plaintext alert alert-success';
        document.getElementById('searchResult').innerHTML =
            'Active Delegations';
    }

    //delegator, delegatee, vesting_shares, min_delegation_time
    delegationdata.forEach(newObj => {
        name = newObj.delegatee;
        shares = newObj.vesting_shares;
        document.getElementById('delegationList').innerHTML +=
            delegator + ' delegated ' + shares + ' to ' + name + '<br>';
    });
};

//expiring delegations function
window.displayExpire = async () => {
    //clear list
    document.getElementById('delegationList').innerHTML = '';

    //get username
    const delegator = document.getElementById('username').value;

    //user, from time, limit
    const delegationdata = await client.database.call(
        'get_expiring_vesting_delegations',
        [delegator, '2018-01-01T00:00:00', 100]
    );
    console.log(delegationdata);

    if (delegationdata[0] == null) {
        console.log('No delegation information');
        document.getElementById('searchResultContainer').style.display = 'flex';
        document.getElementById('searchResult').className =
            'form-control-plaintext alert alert-danger';
        document.getElementById('searchResult').innerHTML =
            'No delegation information';
    } else {
        document.getElementById('searchResultContainer').style.display = 'flex';
        document.getElementById('searchResult').className =
            'form-control-plaintext alert alert-success';
        document.getElementById('searchResult').innerHTML =
            'Expiring Delegations';
    }

    //vesting_shares, expiration
    delegationdata.forEach(newObj => {
        shares = newObj.vesting_shares;
        date = expiration;
        document.getElementById('delegationList').innerHTML +=
            shares + ' will be released at ' + date + '<br>';
    });
};
