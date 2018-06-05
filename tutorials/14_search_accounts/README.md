# Search Account Names

*By the end of this tutorial you should know how to call a list of user names from the steem blockchain*

This tutorial will show the method of capturing a queried user name, matching that to the steemit database and then displaying the matching names. This tutorial will be run on the `production server`.

## Intro

We are using the `call` function provided by the `dsteem` library to pull user names from the steem blockchain. The information being pulled is dependent on two variables:

 1. The max number of user names that needs to be displayed by the search
 2. The string representing the first characters of the user name you are searching for

A simple HTML interface is used to both capture the string query as well as display the completed search. The layout can be found in the "index.html" file.

## steps

 1. **Configure connection** Configuration of `dsteem` to use the proper connection and network.
 2. **Collecting input variables** Assigning and collecting the necessary variables
 3. **Blockchain query** Finding the data on the blockchain based on the inputs
 4. **Output** Displaying query results

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

2. **Collecting input variables**

Next we assign the max number of lines that will be returned by the query. We also use `getElementById` to retrieve the requested user name for searching from the HTML interface. The `max` value can very easily also be attained from the HTML side simply by adding another input line in `index.html` and a second `getElementById` line.

```javascript
const max = 10;
window.submitAcc = async () => {
    const accSearch = document.getElementById("username").value;
```

3. **Blockchain query**

The next step is to pull the user names from the blockchain that matches the "username" variable that was retrieved. This is done using the `database.call` function and assigning the result to an array.

```javascript
const _accounts = await client.database.call('lookup_accounts',[accSearch, max]);
    console.log(`_accounts:`, _accounts);
```

4. **Output**

Finally we create a list from the "_accounts" array generated in step 3.

```javascript
document.getElementById('accList').innerHTML = _accounts.join('<br>');
}
```

## To run this tutorial

 1. clone this repo
 2. `cd tutorials/13_reblogging_post`
 3. `npm i`
 4. `npm run start`

 To run this tutorial in development mode simply replace the last statement with `npm run dev-server`
 Running in dev mode will start the same web server accessible from `http://localhost:3000/` but will also automatically refresh your browser with any changes you make to the code.
