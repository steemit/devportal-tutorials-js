//Step 1.
const dsteem = require('dsteem');
//define network parameters
let opts = {};
opts.addressPrefix = 'STX';
opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673';
//connect to a steem node, testnet in this case
const client = new dsteem.Client('https://testnet.steem.vc', opts);

// const dsteem = require('dsteem');
// //define network parameters
// let opts = {};
// opts.addressPrefix = 'STM';
// opts.chainId =
//     '0000000000000000000000000000000000000000000000000000000000000000';
// //connect to a steem node, production in this case
// const client = new dsteem.Client('https://api.steemit.com');

//Step 2. user fills in the values for 'parent_author' and 'parent_permlink'

//Follow function
window.submitFollow = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const follower = document.getElementById('username').value;
    //get author permalink
    const following = document.getElementById('author').value;

    //Step 3. checking whether author is already followed

    console.log({ follower: follower, following: following });

    let status = await client.call('follow_api', 'get_following', [
        follower,
        following,
        'blog',
        1,
    ]);

    console.log({ status: status });

    if (status.length > 0 && status[0].following == following) {
        type = '';
    } else {
        type = 'blog';
    }

    //Step 4. follow and unfollow is executed by the same operation with a change in only one of the parameters

    const json = JSON.stringify([
        'follow',
        {
            follower: follower,
            following: following,
            what: [type], //null value for unfollow, 'blog' for follow
        },
    ]);

    const data = {
        id: 'follow',
        json: json,
        required_auths: [],
        required_posting_auths: [follower],
    };

    //with variables assigned we can broadcast the operation

    client.broadcast.json(data, privateKey).then(
        function(result) {
            console.log(
                'user follow result: ', result
            );
            document.getElementById('followResultContainer').style.display =
                'flex';
            document.getElementById('followResult').className =
                'form-control-plaintext alert alert-success';
            if (type == 'blog') {
                document.getElementById('followResult').innerHTML = 'Author followed';

            } else {
                document.getElementById('followResult').innerHTML = 'Author unfollowed';
            }
        },
        function(error) {
            console.error(error);
            document.getElementById('followResultContainer').style.display =
                'flex';
            document.getElementById('followResult').className =
                'form-control-plaintext alert alert-danger';
            document.getElementById('followResult').innerHTML =
                error.jse_shortmsg;
        }

    );
};