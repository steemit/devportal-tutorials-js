import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);

//active delegations function
window.createList = async () => {
    //clear list
    document.getElementById('delegationList').innerHTML = '';

    //get username
    const delegator = document.getElementById('username').value;

    //account, from, limit
    const delegationdata = await client.database.getVestingDelegations(
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
        var name = newObj.delegatee;
        var shares = newObj.vesting_shares;
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
