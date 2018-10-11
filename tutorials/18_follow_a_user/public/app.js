//Step 1.
import { Client, PrivateKey } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, testnet in this case
const client = new Client(NetConfig.url, opts);

//Follow function
window.submitFollow = async () => {
    //get private key
    const privateKey = PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const follower = document.getElementById('username').value;
    //get author permalink
    const following = document.getElementById('author').value;

    //Step 3. checking whether author is already followed
    //for full explanation of the process refer to tutorial 19_get_follower_and_following_list

    let status = await client.call('follow_api', 'get_following', [
        follower,
        following,
        'blog',
        1,
    ]);

    console.log({ status: status });

    if (status.length > 0 && status[0].following == following) {
        var type = '';
    } else {
        var type = 'blog';
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
            console.log('user follow result: ', result);
            document.getElementById('followResultContainer').style.display =
                'flex';
            document.getElementById('followResult').className =
                'form-control-plaintext alert alert-success';
            if (type == 'blog') {
                document.getElementById('followResult').innerHTML =
                    'Author followed';
            } else {
                document.getElementById('followResult').innerHTML =
                    'Author unfollowed';
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

window.onload = async () => {
    const account = NetConfig.accounts[0];
    const accountI = NetConfig.accounts[1];
    document.getElementById('username').value = account.address;
    document.getElementById('postingKey').value = account.privPosting;
    document.getElementById('author').value = accountI.address;
};
