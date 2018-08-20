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

//get_content of the post and get_content_replies
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

        //get_content_replies of the selected post
        client.database
            .call('get_content_replies', [author, permlink])
            .then(result => {
                const comments = [];
                for (var i = 0; i < result.length; i++) {
                    comments.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                    <div class="d-flex w-100 justify-content-between">\
                      <h5 class="mb-1">@${result[i].author}</h5>\
                      <small class="text-muted">${new Date(
                          result[i].created
                      ).toString()}</small>\
                    </div>\
                    <p class="mb-1">${md.render(result[i].body)}</p>\
                    <small class="text-muted">&#9650; ${
                        result[i].net_votes
                    }</small>\
                  </div>`
                    );
                }
                document.getElementById('postComments').style.display = 'block';
                document.getElementById(
                    'postComments'
                ).innerHTML = comments.join('');
            });
    });
};
//go back from post view to list
window.goback = async () => {
    document.getElementById('postList').style.display = 'block';
    document.getElementById('postBody').style.display = 'none';
    document.getElementById('postComments').style.display = 'none';
};
