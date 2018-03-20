const steem = require('steem');

function fetchBlog()
{
    const query = {
        tag: 'steemitblog',
        limit: 5
    };
    steem.api.getDiscussionsByBlogAsync(query).then((result) => {
        var posts = [];
        result.forEach( (post) => {
            const image = JSON.parse(post.json_metadata).image[0];
            const title = post.title;
            const author = post.author;
            const created = new Date(post.created).toDateString();
            posts.push(
                `<a href="#" class="list-group-item"><h4 class="list-group-item-heading">${title}</h4><p>by ${author}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center><p class="list-group-item-text text-right text-nowrap">${created}</p></a>`
            )
        });

        document.getElementById('postList').innerHTML = posts.join();
    }).catch((err) => {
    	alert('Error occured');
    });
}

window.onload = fetchBlog();