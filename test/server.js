var express = require('express');
var contract = require("./contract/index.js");


// Create a new Express application.
var app = express();

var port = process.env.port || 8080;
var address = process.env.address || '0.0.0.0';

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Microsoft BlockchainSckool darkchain', resave: true, saveUninitialized: true }));

//public folder 
app.use('/', express.static('public/app'));

app.get('/profile',
  function(req, res){
    res.status(200).json({user: req.user});
  });

app.get('/api/list',
  function(req, res){
    res.status(200).json({list: 'list'});
  });

app.get('/eth/address',  
  function(req, res){
    var address = contract.address();
    res.status(200).json('Address: [' + address + "]");
  });

app.get('/eth/AddRights/:address&:perm',
  function(req, res){
    var AddRights = contract.AddRights(req.params.address, req.params.perm);
    res.status(200).json('AddRights: [' + AddRights + "]");
  });

app.get('/eth/GiveTokenPerm/:address&:token',
  function(req, res){
    var GiveTokenPerm = contract.GiveTokenPerm(req.params.address, req.params.token);
    res.status(200).json('GiveTokenPerm: [' + GiveTokenPerm + "]");
  });

app.get('/eth/PartiesList/:hash',
  function(req, res){
    var PartiesList = contract.PartiesList(req.params.hash);
    res.status(200).json('PartiesList: [' + PartiesList + "]");
  });

app.get('/eth/AddHash/:hash&:token',
  function(req, res){
    var AddHash = contract.AddHash(req.params.hash, req.params.token);
    res.status(200).json('AddHash: [' + AddHash + "]");
  });

app.get('/eth/RequestC/:hash&:token',
  function(req, res){
    var RequestC = contract.RequestC(req.params.hash, req.params.token);
    res.status(200).json('RequestC: [' + RequestC + "]");
  });

app.get('/eth/Request/:hash&:token',
  function(req, res){
    var Request = contract.Request(req.params.hash, req.params.token);
    res.status(200).json('Request: [' + Request + "]");
  });

app.get('/eth/RequestPC/:hash&:token',
  function(req, res){
    var RequestPC = contract.RequestPC(req.params.hash, req.params.token);
    res.status(200).json('RequestPC: [' + RequestPC + "]");
  });

app.listen(port);
