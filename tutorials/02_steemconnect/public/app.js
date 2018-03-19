const sc2 = require('sc2-sdk');

// init steemconnect
let api = sc2.Initialize({
    app:'demo-app',
    callbackURL: 'http://localhost:3000',
    accessToken: 'access_token',
    scope: ['vote','comment']
})
// get login URL
let link = api.getLoginURL();

// acquire access_token and username after authorization
let access_token = new URLSearchParams(document.location.search).get("access_token");
let username = new URLSearchParams(document.location.search).get("username");

let t = ''; 
if (access_token) {
    // set access token after login
    api.setAccessToken(access_token);

    // Link Logout and Get user details functions
    t = `<a href="#" onclick='logOut()'>Log Out</a><p>User: <b>${username}</b> <a href="#" onclick='getUser()'>Get User details</a></p><pre id="json"></pre>`
} else {
    // Login URL link
    t = `<a href=${link}>Log In</a>`;
}

// set template
document.getElementById("content").innerHTML = t;

// Logout function, revoke access token
window.logOut = () => {
    api.revokeToken(function(err, res){
        if (res && res.success){
            access_token = null;
            document.location.href='/';
        }
    });
    return false;
}

// Get User details function, returns user data via Steemconnect API
window.getUser = () => { 
    api.me(function(err,res){
        if (res) {
            user = JSON.stringify(res, undefined, 2);
            document.getElementById("json").innerHTML = user;
        }
    }); 
};