var express = require('express');
var http = require("http");
var https = require("https");
var idContract = require("./contract/id.js");
var services = require("./contract/services.js");
var params = require("./contract/config.json");
var fs = require("fs");
var crypto = require("crypto");
var jwt = require('jsonwebtoken');
var accountconfig = require("./accountconfig/accountconfig.json");

var flat = require('node-flat-db');
var storage = require('node-flat-db/file-sync');
var db = flat('./db/db.json', { storage: storage });
var events = flat('./contract/events.json', { storage: storage});
var uuid = require("uuid");

/**
 * Configure ssl keys
 */
//var privateKeyFile = params.PRIVATE_KEY_FILE;
//var certificateFile = params.CERTIFICATE_FILE;

//console.log(privateKeyFile);
//console.log(certificateFile);
//var privateKey  = fs.readFileSync(privateKeyFile, 'utf8');
//var certificate = fs.readFileSync(certificateFile, 'utf8');

//var credentials = {key: privateKey, cert: certificate};

var helmet = require('helmet');

// Create a new Express application.
var app = express();

/**
 * REST Server configuration.
 */
var port = params.port || 8080;
var https_port = params.https_port || 443;
var address = params.address || '0.0.0.0';
var use_https = params.enable_https;

app.use(require('body-parser').urlencoded({ extended: true }));

//Security
app.use(helmet());
app.disable('x-powered-by');

app.use('/login', express.static(__dirname + '/app'));

function createToken(user){
  return jwt.sign({login: user.login}, accountconfig.secret, { expiresIn: accountconfig.expiresIn });
}

app.post('/auth', function (req, res) {
  var login = req.body.login;
  var password = req.body.password;
  var auth = false;
  console.log(req.body.login);  
  if (req.body.login) {
    if( login != void 0 && password != void 0 )
    {
      console.log("auth");
      var user = db('users').find({login: login});
      if (user){        
        console.log(crypto.createHash('sha256').update(password).digest('base64'));
        auth = user.pwdHash == crypto.createHash('sha256').update(password).digest('base64');
        if (auth){
          /*
          req.session.auth = auth;
          req.session.login = login;
          res.end();    
          */
          
          res.status(201).send({ token: createToken(user)
          });

          //res.redirect('/testsession');            
        }
      } 
    }
  }  
  if (!auth) {res.redirect('/login');}
});

function loadUser1(req, res, next) {
   console.log('loadUser');
   if (req.session.login) {
    //console.log(req.session.auth);
    //console.log(req.session.login);
      if(req.session.auth === true){
        //console.log(req.session.user);
        next();
      } else {
        res.status(200).json({result: null, error:'Please login!'});
      }    
   } else {
     res.status(200).json({result: null, error:'Please login!'});
   }
}

function loadUser(req, res, next) {
   console.log('loadUser');
   
   var token = null;
   if (req.method === "POST"){
     token = req.body.token;
   } else {
     if (req.method === "GET"){
       token = req.query.token;
     }
   }
   
   if (token) {
     var login = jwt.verify(token, accountconfig.secret);
     console.log(login);
     if (login) {
       var user = db('users').find({login: login.login});
       console.log(user);
       if (user) {
         console.log(user);
         next();
       } else {
          res.status(200).json({result: null, error:'Please login 1!'});
       }
     } else {
        res.status(200).json({result: null, error:'Please login 2!'});
     }
   } else {
     res.status(200).json({result: null, error:'Parameter <token> not found.'});
   }
}  

app.get('/test', loadUser, 
function(req, res){ 
  console.log("test");  
  console.log(crypto.createHash('sha256').update("test").digest('hex'));
  res.setHeader('Content-Type', 'text/html');
    res.write('<p>login success </p>');
    res.end();
});

app.post('/test', loadUser, function(req, res){
  console.log("test");
  res.setHeader('Content-Type', 'text/html');
    res.write('<p>login success </p>');
    res.end();
});


//Is transaction in block
app.get('/waitTx/:txHash', loadUser,
  function(req, res){

    services.waitTx(req.params.txHash)
    .then(function(result){
      res.status(200).json({result:result, error: null});
    })
    .catch(function(error){
      res.status(500).json({result: null, error: error.message});
    });
});

//Get event
app.get('/id/event', loadUser,
  function(req, res){
    console.log("/id/event");
    if (req.query.txhash){
      var event = db('events').find({transactionHash: req.query.txhash});
      if (user){
        res.status(200).json({result: event, error: null});
      } else {
        res.status(200).json({result: null, error: "Event not found."});
      }
    } else {
      res.status(200).json({result: null, error: "Parameter <txhash> not found."});
    }
        
});

//Get address of administartion contract
app.get('/id/address', loadUser, 
  function(req, res){    
    console.log('address/id');
    idContract.address()
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    });
});

//Participant REST API
//Add customer
app.post('/id/AddCustomerHash', loadUser,
  function(req, res){
    console.log("/id/AddCustomerHash params:")
    console.log(req.body.hashtoken);
    console.log(req.body.hash);
    idContract.AddHash(req.body.hashtoken, req.body.hash, {gas: params.gas})
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });


//Give token permission  
app.post('/id/GiveTokenPerm', loadUser,
  function(req, res){
    console.log("/id/GiveTokenPerm params:")
    console.log(req.body.address);
    console.log(req.body.hashtoken);
    idContract.GiveTokenPerm(req.body.address, req.body.hashtoken, {gas: params.gas})
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });  

//Request by call function 
app.get('/id/RequestC', loadUser,
  function(req, res){
    console.log("/id/RequestC params:")
    console.log(req.query.hashtoken);
    console.log(req.query.hash);
    idContract.RequestC(req.query.hashtoken, req.query.hash, {gas: params.gas})
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

//Request with transaction sending  
app.get('/id/Request', loadUser,
  function(req, res){
    console.log("/id/Request params:")
    console.log(req.query.hashtoken);
    console.log(req.query.hash);
    idContract.Request(req.query.hash, req.query.token, {gas: params.gas})
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

//Request with permission control
app.get('/id/RequestP', loadUser,
  function(req, res){
    console.log("/id/RequestP params:")
    console.log(req.query.hashtoken);
    console.log(req.query.hash);
    idContract.RequestP(req.query.hash, req.query.token, {gas: params.gas})
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });
  
app.get('/teapot',
  function(req,res){
    res.sendStatus(418);
  });

// HTTP server
/*
var http_app = new express();
http_app.all('*', function(req, res){
  res.status(400).send('Use HTTPS protocol instead HTTP.');  
});
*/
var server = http.createServer(app);
server.listen(port, function () {
  console.log('HTTP server listening on port ' + port);
});

// HTTPS server
/*
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(https_port, function(){
	console.log('HTTPS server listening on port ' + https_port );
});
*/