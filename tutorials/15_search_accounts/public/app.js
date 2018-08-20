const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');



//submitAcc function from html input
const max = 10;
window.submitAcc = async () => {
    const accSearch = document.getElementById("username").value;
    
    const _accounts = await client.database.call('lookup_accounts',[accSearch, max]);
    console.log(`_accounts:`, _accounts);

//disply list of account names with line breaks
    document.getElementById('accList').innerHTML = _accounts.join('<br>');
}