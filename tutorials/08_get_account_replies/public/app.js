const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

const Remarkable = require('remarkable');
const md = new Remarkable({html: true, linkify: true});        


//fetch list of replies for certain account
async function main() {
    const query = '/@steemitblog/recent-replies';
    client.database
        .call('get_state', [query])
        .then(result => {
            if (!(Object.keys(result.content).length === 0 && result.content.constructor === Object)) {
                var replies = [];
                Object.keys(result.content).forEach(key => {
                    const reply = result.content[key];
                    const author = reply.author;
                    const created = new Date(reply.created).toDateString();
                    const body = md.render(reply.body);
                    const netvotes = reply.net_votes;
                    replies.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                        <div class="d-flex w-100 justify-content-between">\
                          <h5 class="mb-1">@${author}</h5>\
                          <small class="text-muted">${created}</small>\
                        </div>\
                        <p class="mb-1">${body}</p>\
                        <small class="text-muted">&#9650; ${netvotes}</small>\
                      </div>`
                    );
                });
                document.getElementById('replies').style.display = 'block';
                document.getElementById('replies').innerHTML = replies.join('');
            }
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, please reload the page');
        });
}
//catch error messages
main().catch(console.error);
