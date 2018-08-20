const dsteem = require('dsteem');
const Remarkable = require('remarkable');

let opts = {};

//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

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
                console.log(post);
                const json = JSON.parse(post.json_metadata);
                const image = json.image ? json.image[0] : '';
                const title = post.title;
                const author = post.author;
                const permlink = post.permlink;
                const created = new Date(post.created).toDateString();
                posts.push(
                    `<div class="list-group-item" onclick=openPost("${author}","${permlink}")><h4 class="list-group-item-heading">${title}</h4><p>by ${author}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center><p class="list-group-item-text text-right text-nowrap">${created}</p></div>`
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
    client.database.call('get_content', [author, permlink]).then(result => {
        const md = new Remarkable({ html: true, linkify: true });
        const body = md.render(result.body);
        const content = `<div class='pull-right'><button onclick=goback()>Close</button></div><br><h2>${
            result.title
        }</h2><br>${body}<br>`;

        document.getElementById('postList').style.display = 'none';
        document.getElementById('postBody').style.display = 'block';
        document.getElementById('postBody').innerHTML = content;
    });
};
//go back from post view to list
window.goback = async () => {
    document.getElementById('postList').style.display = 'block';
    document.getElementById('postBody').style.display = 'none';
};
