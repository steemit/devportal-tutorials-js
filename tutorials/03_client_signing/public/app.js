import { Client, PrivateKey } from 'dsteem'; //import the api client library
import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };
const client = new Client(NetConfig.url, opts);

let elMessage;
let privateKey = '';
let accountAddress = '';
let opType = '';
let op = {};
let stx;
let expireTime = 60 * 1000; //1 min
let head_block_number = 0;
let head_block_id = '';

async function main() {
    //get current state of network
    const props = await client.database.getDynamicGlobalProperties();
    //extract last/head block number
    head_block_number = props.head_block_number;
    //extract block id
    head_block_id = props.head_block_id;

    elMessage.innerText = 'Ready';
}

window.onload = () => {
    //prep for user interactions
    elMessage = document.getElementById('ui-message');
    //populate our account chooser
    document.getElementById('account').innerHTML += NetConfig.accounts
        .map((account, i) => `<option value="${i}">${account.address}</option>`)
        .join('');

    elMessage.innerText =
        'Give it a moment. We do not yet have the head block....';
    main().catch(error => {
        console.error('ERROR', error);
        elMessage.innerText =
            'Unable to get head block. Tutorial may not function properly';
    });
};

//account change selection function
window.accountChange = async () => {
    const account =
        NetConfig.accounts[document.getElementById('account').value];
    //get private key for selected account
    privateKey = PrivateKey.fromString(account.privActive);

    //get selected account address/name
    accountAddress = account.address;
};

//operation type change selection function
window.opChange = async () => {
    //get operation type
    opType = document.getElementById('optype').value;
};

//generate transaction function
window.generateTx = () => {
    //check operation type
    if (opType == 'vote') {
        //vote operation/transaction
        op = {
            ref_block_num: head_block_number, //reference head block number required by tapos (transaction as proof of stake)
            ref_block_prefix: Buffer.from(head_block_id, 'hex').readUInt32LE(4), //reference buffer of block id as prefix
            expiration: new Date(Date.now() + expireTime)
                .toISOString()
                .slice(0, -5), //set expiration time for transaction (+1 min)
            operations: [
                [
                    'vote',
                    {
                        voter: accountAddress,
                        author: 'test',
                        permlink: 'test',
                        weight: 10000,
                    },
                ],
            ], //example of operation object for vote
            extensions: [], //extensions for this transaction
        };
        //set operation output
        document.getElementById('OpInput').innerHTML = JSON.stringify(
            op,
            undefined,
            2
        );
    }
    if (opType == 'follow') {
        //follow operation
        op = {
            ref_block_num: head_block_number,
            ref_block_prefix: Buffer.from(head_block_id, 'hex').readUInt32LE(4),
            expiration: new Date(Date.now() + expireTime)
                .toISOString()
                .slice(0, -5),
            operations: [
                [
                    'custom_json',
                    {
                        required_auths: [],
                        required_posting_auths: [accountAddress],
                        id: 'follow',
                        json:
                            '["follow",{"follower":"' +
                            accountAddress +
                            '","following":"test","what":["blog"]}]',
                    },
                ],
            ], //example of custom_json for follow operation
            extensions: [],
        };
        document.getElementById('OpInput').innerHTML = JSON.stringify(
            op,
            undefined,
            2
        );
    }
    if (opType == 'reblog') {
        //reblog operation
        op = {
            ref_block_num: head_block_number,
            ref_block_prefix: Buffer.from(head_block_id, 'hex').readUInt32LE(4),
            expiration: new Date(Date.now() + expireTime)
                .toISOString()
                .slice(0, -5),
            operations: [
                [
                    'custom_json',
                    {
                        required_auths: [],
                        required_posting_auths: [accountAddress],
                        id: 'follow',
                        json:
                            '["reblog",{"account":"' +
                            accountAddress +
                            '","author":"test","permlink":"test"}]',
                    },
                ],
            ], //example of custom_json for reblog operation
            extensions: [],
        };
        document.getElementById('OpInput').innerHTML = JSON.stringify(
            op,
            undefined,
            2
        );
    }
};

window.signTx = () => {
    //sign transaction/operations with user's privatekey
    stx = client.broadcast.sign(op, privateKey);
    //set output
    document.getElementById('TxOutput').innerHTML = JSON.stringify(
        stx,
        undefined,
        2
    );
    console.log(stx);
};

window.verifyTx = async () => {
    //verify signed transaction authority
    const rv = await client.database.verifyAuthority(stx);
    //set checkmark or crossmark depending on outcome
    let node = document.getElementById('verifyBtn');
    rv
        ? node.insertAdjacentHTML('afterend', '&nbsp;&#x2714;&nbsp;')
        : node.insertAdjacentHTML('afterend', '&nbsp;&#x2717;&nbsp;');
};

window.broadcastTx = async () => {
    //broadcast/send transaction to the network
    const res = await client.broadcast.send(stx);
    //set output
    document.getElementById('ResOutput').innerHTML = JSON.stringify(
        res,
        undefined,
        2
    );
};
