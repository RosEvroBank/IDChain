
var Web3 = require('web3');
var web3 = new Web3();
var rpc_url = process.env.rpc_url;
var address = process.env.contract_address;

web3.setProvider(new web3.providers.HttpProvider(rpc_url));

var pilot = {};

if(web3.isConnected()){
        
        var abi = [{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_token","type":"bytes32"}],"name":"GiveTokenPerm","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash1","type":"bytes32"},{"name":"_token","type":"bytes32"}],"name":"RequestPC","outputs":[{"name":"hres1","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash1","type":"bytes32"}],"name":"PartiesList","outputs":[{"name":"result","type":"address[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"MHash1","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"MAdmin","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"inc","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hash2","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"add","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"MTokenPerm","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"MHash2","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash1","type":"bytes32"},{"name":"_token","type":"bytes32"}],"name":"AddHash","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetPartyPerm","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hash1","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"MProfileRating","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"MProfileParties","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"hash3","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"MHash3","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash1","type":"bytes32"},{"name":"_hash2","type":"bytes32"},{"name":"_hash3","type":"bytes32"},{"name":"_token","type":"bytes32"}],"name":"Request","outputs":[{"name":"hres1","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_perm","type":"uint8"}],"name":"AddRights","outputs":[{"name":"_result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash1","type":"bytes32"},{"name":"_hash2","type":"bytes32"},{"name":"_hash3","type":"bytes32"},{"name":"_token","type":"bytes32"}],"name":"RequestC","outputs":[{"name":"hres1","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_token","type":"bytes32"},{"indexed":false,"name":"_result","type":"bool"}],"name":"Answer","type":"event"}];

        var coinbase = web3.eth.coinbase;

        pilot = web3.eth.contract(abi).at(address);
        
        web3.eth.defaultAccount = web3.eth.accounts[0];
} else {
    pilot.error = "Error created contract";
}        

module.exports.address = function(){
    return JSON.stringify(pilot);
}

module.exports.AddRights = function(address, perm){
    console.log('address=<' + address + '> perm=<' + perm + '>');
    if(!!pilot){
        var result = pilot.AddRights.sendTransaction(address, perm);
        return result;
    }
}

module.exports.GiveTokenPerm = function(address, token){
    console.log('address=<' + address + '> token=<' + token + '>');
    if(!!pilot){
        var result = pilot.GiveTokenPerm.sendTransaction(address, token);
        return result;
    }
}

module.exports.PartiesList = function(hash){
    if (!!pilot){
        var result = pilot.PartiesList.call(hash);
        return result;
    }
}

module.exports.AddHash = function(hash, token){
    console.log('hash=<' + hash + '> token=<' + token + '>');
    //console.log(token);
    
    if(!!pilot){
        var result = pilot.AddHash.sendTransaction(hash, token);
        return result;
    }
}

module.exports.RequestC = function(hash, token){
    if (!!pilot){
        var result = pilot.RequestC.call(hash, token);
        return result;
    }
}

module.exports.RequestPC = function(hash, token){
    console.log('hash=<' + hash + '> token=<' + token + '>');
    if (!!pilot){
        var result = pilot.RequestPC.call(hash, token);
        return result;
    }
}

module.exports.Request = function(hash, token){
    console.log('hash=<' + hash + '> token=<' + token + '>');
    if (!!pilot){
        var result = pilot.Request.sendTransaction(hash, token);
        return result;
    }
}
