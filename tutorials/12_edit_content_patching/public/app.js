const dsteem = require('dsteem');
let opts = {};

//connect to community testnet
opts.addressPrefix = 'STX';
opts.chainId =
    '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://testnet.steem.vc', opts);

const diff_match_patch = require('diff-match-patch');
const dmp = new diff_match_patch();
let o_body = '';
let o_permlink = '';

//fetch list of comments for certain account
async function main() {
    const query = { tag: 'demo', limit: '1' };
    client.database
        .call('get_discussions_by_blog', [query])
        .then(result => {
            document.getElementById('title').value = result[0].title;
            document.getElementById('body').value = result[0].body;
            document.getElementById('tags').value = JSON.parse(
                result[0].json_metadata
            ).tags.join(' ');
            o_body = result[0].body;
            o_permlink = result[0].permlink;
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, please reload the page');
        });
}
//catch error messages
main().catch(console.error);

function createPatch(text, out) {
    if (!text && text === '') return undefined;
    const patch_make = dmp.patch_make(text, out);
    const patch = dmp.patch_toText(patch_make);
    return patch;
}

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
    const edited_body = document.getElementById('body').value;

    let body = '';

    //computes a list of patches to turn o_body to edited_body
    const patch = createPatch(o_body, edited_body);

    //check if patch size is smaller than original content
    if (patch && patch.length < new Buffer(o_body, 'utf-8').length) {
        body = patch;
    } else {
        body = o_body;
    }

    //get tags and convert to array list
    const tags = document.getElementById('tags').value;
    const taglist = tags.split(' ');
    //make simple json metadata including only tags
    const json_metadata = JSON.stringify({ tags: taglist });
    //generate random permanent link for post
    const permlink = o_permlink;

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
}