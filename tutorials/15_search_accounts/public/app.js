import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);



//submitAcc function from html input
const max = 10;
window.submitAcc = async () => {
    const accSearch = document.getElementById("username").value;
    
    const _accounts = await client.database.call('lookup_accounts',[accSearch, max]);
    console.log(`_accounts:`, _accounts);

//disply list of account names with line breaks
    document.getElementById('accList').innerHTML = _accounts.join('<br>');
}