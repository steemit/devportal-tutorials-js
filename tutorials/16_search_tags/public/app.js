const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

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
