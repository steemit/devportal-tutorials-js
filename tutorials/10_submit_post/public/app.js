const dsteem = require('dsteem');
let opts = {};

//connect to community testnet
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://testnet.steem.vc', opts);

//submit post function
window.submitPost = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const account = document.getElementById('username').value;
    //get title
    const title = document.getElementById('title').value;
    //get body
    const body = document.getElementById('body').value;
    //get tags and convert to array list
    const tags = document.getElementById('tags').value;
    const taglist = tags.split(' ');
    //make simple json metadata including only tags
    const json_metadata = JSON.stringify({ tags: taglist });
    //generate random permanent link for post
    const permlink = Math.random()
        .toString(36)
        .substring(2);

    client.broadcast
        .comment(
            {
                author: account,
                body: body,
                json_metadata: json_metadata,
                parent_author: '',
                parent_permlink: taglist[0],
                permlink: permlink,
                title: title,
            },
            privateKey
        )
        .then(
            function(result) {
                document.getElementById('title').value = '';
                document.getElementById('body').value = '';
                document.getElementById('tags').value = '';
                document.getElementById('postLink').style.display = 'block';
                document.getElementById(
                    'postLink'
                ).innerHTML = `<br/><p>Included in block: ${
                    result.block_num
                }</p><br/><br/><a href="http://condenser.steem.vc/${
                    taglist[0]
                }/@${account}/${permlink}">Check post here</a>`;
            },
            function(error) {
                console.error(error);
            }
        );
};

window.onload = async () => {
    const response = await fetch("login.json");
    const json = await response.json();
    //console.log(json);
    document.getElementById('postingKey').value = json.privPosting1;
    document.getElementById('username').value = json.username1;
};