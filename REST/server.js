var express = require('express');
var http = require("http");
var https = require("https");
var contract = require("./contract/Identify");
var fs = require("fs");
/**
 * Configure ssl keys
 */
var privateKeyFile = process.env.PRIVATE_KEY_FILE;
var certificateFile = process.env.CERTIFICATE_FILE;

var privateKey  = fs.readFileSync(privateKeyFile, 'utf8');
var certificate = fs.readFileSync(certificateFile, 'utf8');

var credentials = {key: privateKey, cert: certificate};

// Create a new Express application.
var app = express();

/**
 * REST Server configuration.
 */
var port = process.env.port || 8080;
var https_port = process.env.HTTPS_PORT || 443;
var address = process.env.address || '0.0.0.0';
var use_https = process.env.enable_https || process.env.ENABLE_HTTPS;

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'RosEuroBank developers the best!', resave: true, saveUninitialized: true }));

app.get('/eth/waitTx/:txHash',
  function(req, res){

    contract.waitTx(req.params.txHash)
    .then(function(result){
      res.status(200).json({result:result, error: null});
    })
    .catch(function(error){
      res.status(500).json({result: null, error: error.message});
    });
});

app.get('/eth/get/address',  
  function(req, res){
    contract.address()
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    });    
});

app.get('/eth/AddRights/address=:address&permissions=:perm',
  function(req, res){
    contract.AddRights(req.params.address, req.params.perm)
    .then(function(result){
      res.status(200).json({ result: result, error: null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    });    
});

app.get('/eth/GiveTokenPerm/address=:address&token=:token',
  function(req, res){
    contract.GiveTokenPerm(req.params.address, req.params.token)
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

app.get('/eth/PartiesList/hash=:hash',
  function(req, res){
    contract.PartiesList(req.params.hash)
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

app.get('/eth/AddHash/hash=:hash&token=:token',
  function(req, res){
    contract.AddHash(req.params.hash, req.params.token)
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

app.get('/eth/RequestC/hash=:hash&token=:token',
  function(req, res){
    contract.RequestC(req.params.hash, req.params.token)
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

app.get('/eth/Request/hash=:hash&token=:token',
  function(req, res){
    contract.Request(req.params.hash, req.params.token)
    .then(function(result){
      res.status(200).json({result:result, error:null});
    })
    .catch(function(error){
      res.status(500).json({ result: null, error: error.message});
    }); 
  });

app.get('/eth/RequestPC/hash=:hash&token=:token',
  function(req, res){
    contract.RequestPC(req.params.hash, req.params.token)
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

app.use(function(req, res){
  res.sendStatus(404);
});

// HTTP server
var http_app = new express();
http_app.all('*', function(req, res){
  res.status(400).send('Use HTTPS protocol instead HTTP.');  
});
var server = http.createServer(http_app);
server.listen(port, function () {
  console.log('HTTP server listening on port ' + port);
});

// HTTPS server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(https_port, function(){
	console.log('HTTPS server listening on port ' + https_port );
});


