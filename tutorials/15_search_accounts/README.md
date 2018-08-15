# Search Account Names

_By the end of this tutorial you should know how to call a list of user names from the steem blockchain_

This tutorial will show the method of capturing a queried user name, matching that to the steem database and then displaying the matching names. This tutorial will be run on the `production server`.

## Intro

We are using the `call` function provided by the `dsteem` library to pull user names from the steem blockchain. The information being pulled is dependent on two variables:

1.  The max number of user names that needs to be displayed by the search
1.  The string representing the first characters of the user name you are searching for

A simple HTML interface is used to both capture the string query as well as display the completed search. The layout can be found in the "index.html" file.

## Steps

1.  [**Configure connection**](#configure_connection) Configuration of `dsteem` to use the proper connection and network.
1.  [**Collecting input variables**](#collecting_input_variables) Assigning and collecting the necessary variables
1.  [**Blockchain query**](#blockchain_query) Finding the data on the blockchain based on the inputs
1.  [**Output**](#output) Displaying query results


#### 1. **Configure connection**<a name="configure_connection"></a>

Below we have `dsteem` pointing to the production network with the proper chainId, addressPrefix, and endpoint by importing from the `configuration.js` file. There is a `public/app.js` file which holds the Javascript segment of this tutorial. In the first few lines we define the configured library and packages:

```javascript
import { Client } from 'dsteem';
import { Mainnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

let opts = { ...NetConfig.net };

//connect to a steem node, mainnet in this case
const client = new Client(NetConfig.url, opts);
```

#### 2.  **Collecting input variables**<a name="collecting_input_variables"></a>

Next we assign the max number of lines that will be returned by the query. We also use `getElementById` to retrieve the requested user name for searching from the HTML interface. The `max` value can very easily also be attained from the HTML side simply by adding another input line in `index.html` and a second `getElementById` line.

```javascript
const max = 10;
window.submitAcc = async () => {
    const accSearch = document.getElementById("username").value;
```

#### 3.  **Blockchain query**<a name="blockchain_query"></a>

The next step is to pull the user names from the blockchain that matches the "username" variable that was retrieved. This is done using the `database.call` function and assigning the result to an array.

```javascript
const _accounts = await client.database.call('lookup_accounts',[accSearch, max]);
    console.log(`_accounts:`, _accounts);
```

#### 4.  **Output**<a name="output"></a>

Finally we create a list from the "_accounts" array generated in step 3.

```javascript
document.getElementById('accList').innerHTML = _accounts.join('<br>');
}
```

## To run this tutorial

1.  clone this repo
1.  `cd tutorials/15_search_accounts`
1.  `npm i`
1.  `npm run dev-server` or `npm run start`
1.  After a few moments, the server should be running at http://localhost:3000/
