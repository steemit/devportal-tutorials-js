import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);

//fetch list of trending posts
async function main() {
    const query = {
        tag: '',
        limit: 5,
        truncate_body: 1,
    };
    client.database
        .getDiscussions('trending', query)
        .then(result => {
            var posts = [];
            result.forEach(post => {
                console.log('post', post);
                const json = JSON.parse(post.json_metadata);
                const image = json.image ? json.image[0] : '';
                const title = post.title;
                const author = post.author;
                const permlink = post.permlink;
                const created = new Date(post.created).toDateString();
                posts.push(
                    `<div class="list-group-item" onclick="openPost('${author}','${permlink}')"><h4 class="list-group-item-heading">${title}</h4><p>by ${author}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center><p class="list-group-item-text text-right text-nowrap">${created}</p></div>`
                );
            });
            document.getElementById('postList').style.display = 'block';
            document.getElementById('postList').innerHTML = posts.join('');
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, please reload the page');
        });
}
//catch error messages
main().catch(console.error);

//get_content of the post
window.openPost = async (author, permlink) => {
    client.database
        .call('get_active_votes', [author, permlink])
        .then(result => {
            console.log('votes', result, JSON.stringify(result));

            var voters = [];
            voters.push(
                `<div class='pull-right'><button class="btn btn-danger"onclick="goback()">Close</button></div><br>`
            );
            result.forEach(voter => {
                const name = voter.voter;
                const time = new Date(voter.time).toDateString();
                voters.push(`${name} (${time})`);
            });

            document.getElementById('postList').style.display = 'none';
            document.getElementById('postBody').style.display = 'block';
            document.getElementById('postBody').innerHTML = voters.join('<li>');
        });
};
//go back from post view to list
window.goback = async () => {
    document.getElementById('postList').style.display = 'block';
    document.getElementById('postBody').style.display = 'none';
};
