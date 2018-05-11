const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

//fetch list of comments for certain account
async function main() {
    const query = '/@steemitblog/comments';
    client.database
        .call('get_state', [query])
        .then(result => {
            console.log(result);
            if (
                !(
                    Object.keys(result.content).length === 0 &&
                    result.content.constructor === Object
                )
            ) {
                var comments = [];
                Object.keys(result.content).forEach(key => {
                    const comment = result.content[key];
                    const parent_author = comment.parent_author;
                    const parent_permlink = comment.parent_permlink;
                    const created = new Date(comment.created).toDateString();
                    const body = md.render(comment.body);
                    const netvotes = comment.net_votes;
                    comments.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                        <div class="d-flex w-100 justify-content-between">\
                          <h6 class="mb-1">@${comment.author}</h6>\
                          <small class="text-muted">${created}</small>\
                        </div>\
                        <p class="mb-1">${body}</p>\
                        <small class="text-muted">&#9650; ${netvotes}, Replied to: @${parent_author}/${parent_permlink}</small>\
                      </div>`
                    );
                });
                document.getElementById('comments').style.display = 'block';
                document.getElementById('comments').innerHTML = comments.join(
                    ''
                );
            }
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, please reload the page');
        });
}
//catch error messages
main().catch(console.error);
