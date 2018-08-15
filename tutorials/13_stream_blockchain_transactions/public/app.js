import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);

let stream;
let state;
let blocks = [];
//start stream
async function main() {
    stream = client.blockchain.getBlockStream();
    stream
        .on('data', function(block) {
            //console.log(block);
            blocks.unshift(
                `<div class="list-group-item"><h5 class="list-group-item-heading">Block id: ${
                    block.block_id
                }</h5><p>Transactions in this block: ${
                    block.transactions.length
                } <br>Witness: ${
                    block.witness
                }</p><p class="list-group-item-text text-right text-nowrap">Timestamp: ${
                    block.timestamp
                }</p></div>`
            );
            document.getElementById('blockList').innerHTML = blocks.join('');
        })
        .on('end', function() {
            // done
            console.log('END');
        });
}
//catch error messages
main().catch(console.error);

//pause stream
window.pauseStream = async () => {
    state = stream.pause();
};

//resume stream
window.resumeStream = async () => {
    state = state.resume();
};
