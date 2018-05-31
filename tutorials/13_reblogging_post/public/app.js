const dsteem = require('dsteem');

//define network parameters
let opts = {};
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/testnet
const client = new dsteem.Client('https://api.steemit.com', opts);

// This function is taken from the tutorial https://github.com/steemit/devportal-tutorials-js/blob/master/tutorials/01_blog_feed/

function fetchBlog() {
    const query = {
        tag: 'steemitblog',
        limit: 5,
    };
    client.database
        .getDiscussions('blog', query)
        .then(result => {
            var posts = [];
            result.forEach(post => {
                const author = post.author;
                const permlink = post.permlink;
                posts.push(
                    `<li><a href="javascript://" onclick="document.getElementById('theAuthor').value = '${author}'">${author}</a> - <a href="javascript://" onclick="document.getElementById('thePermLink').value = '${permlink}'">${permlink}</a></li>`
                );
            });

            document.getElementById('postList').innerHTML = posts.join('');
        })
        .catch(err => {
            alert('Error occured' + err);
        });
}

window.onload = fetchBlog();

//this function will execute when the HTML form is submitted
window.submitPost = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
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

    client.broadcast.json(data, privateKey).then(
        function(result) {
            console.log('client broadcast result: ', result);
        },
        function(error) {
            console.error(error);
        }
    );
};
