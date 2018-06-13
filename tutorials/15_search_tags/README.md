# Search Tags

*By the end of this tutorial you should know how to run a search for trending tags*

This tutorial will be run on the `production server`.

## Intro

This tutorial will show the method of capturing a queried tag name and matching it to the steemit database. We are using the `call` function provided by the `dsteem` library to pull tags from the steem blockchain. A simple HTML interface is used to both capture the string query as well as display the completed search.

## steps

 1. **Configure connection** Configuration of `dsteem` to use the proper connection and network.
 2. **Search input** Collecting the relevant search criteria
 3. **Run Search** Running the search on the blockchain
 4. **Output** Displaying the results of the search query

1. **Configure connection**

Below we have `dsteem` pointing to the production network with the proper chainId, addressPrefix, and endpoint. There is a `public/app.js` file which holds the Javascript segment of this tutorial. In the first few lines we define the configured library and packages:

```javascript
const dsteem = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dsteem.Client('https://api.steemit.com');
```

2. **Search input**

Collecting of the search criteria happens via an HTML input. The form can be found in the `index.html` file. The values are pulled from that screen with the below:

```javascript
const max = 10;
window.submitTag = async () => {
    const tagSearch = document.getElementById("tagName").value;
```

3. **Run Search**

In order to access the blockchain to run the search a `call` function is used with the `search field` and `maximum` list items as parameters.

```javascript
const _tags = await client.database.call('get_trending_tags',[tagSearch, max]);
```

The result of the search is an array of tags along with their respective vital data like `comments`, `payouts` and such.

4. **Output**

Due to the output from the `call` function being an array, we can't use a simple `post` function to display the tags. The specific fields within the array needs to be selected and then displayed.

```javascript
console.log('tags: ', _tags);
        var posts = [];
        _tags.forEach(post => {
            posts.push(
                `<div class="list-group-item"><h5 class="list-group-item-heading">${post.name}</h5></div>`
            );
        });
//disply list of tags with line breaks
    document.getElementById('tagList').innerHTML = posts.join('<br>');
```

## To run this tutorial

 1. clone this repo
 2. `cd tutorials/15_search_tags`
 3. `npm i`
 4. `npm run start`

 To run this tutorial in development mode simply replace the last statement with `npm run dev-server`
 Running in dev mode will start the same web server accessible from `http://localhost:3000/` but will also automatically refresh your browser with any changes you make to the code.
