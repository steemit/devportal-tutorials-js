const dsteem = require('dsteem');

let opts = {};

//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');

//filter change selection function
window.filtersChange = async () => {
    const filter = document.getElementById('filters').value;
    const query = {
        tag: '',
        limit: 5,
    };
    client.database
        .getDiscussions(filter, query)
        .then(result => {
            if (result) {
                var posts = [];
                result.forEach(post => {
                    const json = JSON.parse(post.json_metadata);
                    const image = json.image ? json.image[0] : '';
                    const title = post.title;
                    const author = post.author;
                    const created = new Date(post.created).toDateString();
                    posts.push(
                        `<div class="list-group-item"><h4 class="list-group-item-heading">${title}</h4><p>by ${author}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center><p class="list-group-item-text text-right text-nowrap">${created}</p></div>`
                    );
                });

                document.getElementById('postList').innerHTML = posts.join('');
            }
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, try again');
        });
};
