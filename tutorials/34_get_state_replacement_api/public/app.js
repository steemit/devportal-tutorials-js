const dsteem = require('dsteem');

let opts = {};

//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');


window.showAccount = async () => {
    console.log('account : ');
    var _info = new Array
    _info = await client.database.getAccounts(['steemitblog']);
    console.log(_info[0]);

}

window.showContent = async () => {
    console.log('content : ');

    const filter = 'trending';
    const query = {
        limit: 20,
    };
    var _info = new Array
    _info = await client.database.getDiscussions(filter, query)
    console.log(_info)

}

window.showPrice = async () => {
    console.log('feed_price : ');

    _info = await client.database.getCurrentMedianHistoryPrice()
    console.log(_info)

}

window.showProps = async () => {
    console.log('props : ');

    _info = await client.database.getDynamicGlobalProperties()
    console.log(_info)

}

window.showTags = async () => {
    console.log('tags : ');

    _info = await client.database.call('get_trending_tags',['', 10])
    console.log(_info)

}

window.showTagidx = async () => {
    console.log('tag_idx : ');

    _info = await client.database.call('get_trending_tags',['', 10])
    _info.forEach(post => {
        console.log(post.name)
    });

}

window.showSchedule = async () => {
    console.log('witness schedule : ');

    _info = await client.database.call('get_witness_schedule',[]);
    console.log(_info);

}

window.showWitness = async () => {
    console.log('witnesses : ');

    var _info = await client.database.call('get_witnesses_by_vote',['',10])
    console.log(_info)

}