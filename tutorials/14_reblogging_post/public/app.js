import { Client, PrivateKey } from 'dsteem';

//define network parameters
let opts = {};
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to a Steem node. This is currently setup on production, but we recommend using a testnet like https://testnet.steem.vc
const client = new Client('https://api.steemit.com', opts);
window.client = client;

//This is a convenience function for the UI.
window.autofillAuthorAndPermlink = function(el) {
    document.getElementById('theAuthor').value = el.dataset.author;
    document.getElementById('thePermLink').value = el.dataset.permlink;
};

function fetchBlog() {
    const query = {
        tag: 'steemitblog',
        limit: 5,
    };

    client.database
        .getDiscussions('blog', query) //get a list of posts for easy resteeming.
        .then(result => {
            //when the response comes back ...
            const postList = [];
            console.log('Listing blog posts by ' + query.tag);
            result.forEach(post => {
                //... loop through the posts ...
                const author = post.author;
                const permlink = post.permlink;
                console.log(author, permlink, post);
                postList.push(
                    // and render the table rows
                    `<tr><td><button class="btn-sm btn-success" data-author="${author}" data-permlink="${permlink}" onclick="autofillAuthorAndPermlink(this)">Autofill</button></td><td>${author}</td><td>${permlink}</td></tr>`
                );
            });

            document.getElementById('postList').innerHTML = postList.join('');
        })
        .catch(err => {
            console.error(err);
            alert('Error occured' + err);
        });
}

//this function will execute when the "Resteem!" button is clicked
window.submitPost = async () => {
    resteemOutput('preparing to submit');
    //get private key
    try {
        const privateKey = PrivateKey.from(
            document.getElementById('postingKey').value
        );

        //get account name
        const myAccount = document.getElementById('username').value;
        //get blog author
        const theAuthor = document.getElementById('theAuthor').value;
        //get blog permLink
        const thePermLink = document.getElementById('thePermLink').value;

        const jsonOp = JSON.stringify([
            'reblog',
            {
                account: myAccount,
                author: theAuthor,
                permlink: thePermLink,
            },
        ]);

        const data = {
            id: 'follow',
            json: jsonOp,
            required_auths: [],
            required_posting_auths: [myAccount],
        };
        resteemOutput('resteeming:\n', JSON.stringify(data, 2));
        console.log('resteeming:', data);
        client.broadcast.json(data, privateKey).then(
            function(result) {
                resteemOutput(result);
                console.log('resteem result: ', result);
            },
            function(error) {
                console.error(error);
            }
        );
    } catch (e) {
        resteemOutput(e.message);
        console.log(e);
    }
};

function resteemOutput(output) {
    document.getElementById('results').innerText = output;
}

window.onload = async () => {
    fetchBlog();
};
