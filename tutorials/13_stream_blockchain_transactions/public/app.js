const dsteem = require('dsteem');

let opts = {};

//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

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
