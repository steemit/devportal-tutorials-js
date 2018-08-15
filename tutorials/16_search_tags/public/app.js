import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);

//submitTab function from html input
const max = 10;
window.submitTag = async () => {
    const tagSearch = document.getElementById('tagName').value;

    //get list of tags from blockchain
    const _tags = await client.database.call('get_trending_tags', [
        tagSearch,
        max,
    ]);

    console.log('tags: ', _tags);
    var posts = [];
    _tags.forEach(post => {
        posts.push(
            `<div class="list-group-item"><h5 class="list-group-item-heading">${
                post.name
            }</h5></div>`
        );
    });
    //disply list of tags with line breaks
    document.getElementById('tagList').innerHTML = posts.join('<br>');
};
