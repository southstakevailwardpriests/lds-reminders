/**
 * Created by Charles on 10/9/2016.
 */
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
var SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
var url = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES
});
var app = require('express')();
var session = require('express-session');
app.use(session({
    store:new (require('connect-pg-simple')(session))(),
    secret:process.env.SESS_SECRET,
    resave:false,
    cookie:{maxAge:7*24*60*60*1000}
}));
var server = require('http').createServer(app);
app.get('/',function(req,res){
    res.redirect(url);
});
app.get('/oathCallback',function(req,res){
    req.session.code = req.query.code;
    res.redirect("/app");
});
app.get("/app",function(req,res){
    res.send(req.session.code);
});
server.listen(process.env.PORT || 3000);