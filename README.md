# devportal-tutorials-js
_Javascript Tutorials for the Developer Portal_

These examples/tutorials will familiarize you with the basics of operating on the steem blockchain.

Each tutorial is located in its own folder, and has a README.md with an outline of the basic concepts 
and operations it intends to teach. 

The tutorials build on each other. It's suggested you go through them in-order.

## Tutorial List
1. [Blog Feed](tutorials/01_blog_feed) - Pull the list of a user's posts from the blockchain
2. [Steemconnect](tutorials/02_steemconnect) - Getting started with setting up Steemconnect
3. [Client-side signing](tutorials/03_client_signing) - Generate, sign, verify and broadcast transactions via client-side without Steemconnect

## Running Tutorials

Each of these tutorials comes with an option to run as a once off bundle -> build -> host option which allows you to then browse and few. 

```
npm run start
```

However there is an option to run each of these tutorials in a dev-server mode which will allow you to host the web server and then make changes to code. As you make changes to the code the browser will automatically update and show your latest code changes. This allows you to quickly update snippets of code and see the results immediately without having to rebuild the code.

```
npm run dev-server
```