const sc2 = require('sc2-sdk');

// init steemconnect
let api = sc2.Initialize({
    app: 'demo-app',
    callbackURL: 'http://localhost:3000',
    accessToken: 'access_token',
    scope: ['vote', 'comment'],
});
// get login URL
let link = api.getLoginURL();

// acquire access_token and username after authorization
let access_token = new URLSearchParams(document.location.search).get(
    'access_token'
);
let username = new URLSearchParams(document.location.search).get('username');

let lt = '',
    ut = '',
    lo = '',
    jt = '',
    t = '';
if (access_token) {
    // set access token after login
    api.setAccessToken(access_token);

    // Logout button
    lt = `<a href="#" onclick='logOut()'>Log Out</a>`;
    // User name after successfull login
    ut = `<p>User: <b>${username}</b></p>`;
    // Get user details button
    lo = `<a href="#" onclick='getUserDetails()'>Get User details</a>`;
    // User details JSON output
    jt = `<pre id="userDetailsJSON"></pre>`;

    t = lt + ut + lo + jt;
} else {
    // Login button
    t = `<a href=${link}>Log In</a>`;
}

// set template
document.getElementById('content').innerHTML = t;

// Logout function, revoke access token
window.logOut = () => {
    api.revokeToken(function(err, res) {
        if (res && res.success) {
            access_token = null;
            document.location.href = '/';
        }
    });
    return false;
};

// Get User details function, returns user data via Steemconnect API
window.getUserDetails = () => {
    api.me(function(err, res) {
        if (res) {
            const user = JSON.stringify(res, undefined, 2);
            document.getElementById('userDetailsJSON').innerHTML = user;
        }
    });
};
