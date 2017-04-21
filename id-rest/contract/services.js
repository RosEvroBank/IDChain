/*!
 * Administration
 * Copyright(c) 2017 RosEvroBank, Anatoliy A Aksenov, Ayrat R Yakubov
 * MIT Licensed
 */

'use strict';

var q = require('q');
var params = require("./config.json");
var accountconfig = require("../accountconfig/accountconfig.json");

/**
 * Module exports
 * @public
 */
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
        module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.TxConfirm = factory();
	}
}(this, function () {
    /**
	 * Identify common components.
     * @private
	 */
    var Common = (function(){
        /**
         * Function for print debug information when debugging enabled.
         * For enable debug call 'export DEBUG=administration' or run server 'DEBUG=administration node server.js'
         * 
         * @param {string} Message for print
         * 
         */
        function debug(str){
          if(/SERVICES|Services|services/g.test(params.DEBUG)){
                    console.log(str);
          }
        }
        debug('Transaction confirmation');
        
        /**
         * Initial Web3 
         * @private
         */
        var web3 = {};
        try {
            var Web3 = require('web3');
            web3 = new Web3();
            debug('web3 loaded');
        } catch (e) {
            throw new Error("Module 'web3' required. Call 'npm install web3' before...");
        }

        /**
         * Ethereum geth RPC server address
         * @private
         */
        var rpc_url;
        if (accountconfig.rpc_url == void 0 ){
            throw new Error("Environment variable 'RPC_URL' required. Call 'set RPC_URL=http://localhost:8545/' before...");
        }        
        rpc_url = accountconfig.rpc_url;
        debug(`rpc_url: ${rpc_url}`);
        /**
         * Initial web3
         */
        var rpc_provider = new web3.providers.HttpProvider(rpc_url);
        try{
            web3.setProvider(rpc_provider);
        } catch (e){
            throw new Error("Error set RPC provider into Web3. Check 'RPC_URL' and 'CONTRACT_ADDRESS' environment variables correct and RPC server online.\n" + e);
        }

        if(!web3.isConnected())
        {
            throw new Error("Can't connect using '"+ rpc_rul + " to Ethereum geth RPC Server.");
        }
        debug('Web3 configured and eabled.');

        /**
         * ABI for Ethereum smart-contract
         * @public
         */
        return {
            /**
             * Debug function. For use call 'set DEBUG=identify' or run application 'DEBUG=identify node server.js'
             * 
             * @param {string} Message for print
             * 
             * @example common.debug('Debug message');
             */
            debug: debug,
            /**
             * Function waits for entered a transaction in the block.
             * 
             * @param {string} Hash of a transaction
             * 
             * @param {function} A function of the smart-contract who fire sendTransaction and generate Hash of transaction
             * 
             * @example waitTx('0xe55a4b986459229fc57c0c718015915aa3336fc8c433d8b400f742e6fc269662', contract.AddHash)
             *          .then(function(txObject){
             *              console.log("%j", txObject)
             *          })
             *          .catch(function(error){
             *              console.log("%j", error);
             *          });
             */
            waitTx: function(txHash){                
                debug(`Starting waitTx function for ${txHash}`);

                var deferred = q.defer();
                if (txHash == void 0){
                    deferred.reject(new Error('txHash undefined.'));
                }

                var tx = web3.eth.getTransactionReceipt(txHash);
                if(tx){
                    if (tx.transactionHash == txHash){
                        deferred.resolve(tx);
                        debug(`tx already in block ${tx.blockNumber}`);
                        return deferred.promise;
                    }
                }
                
                debug(`waiting tx: ${txHash}`);                  
                var filter = web3.eth.filter('latest');
                filter.watch(function(error, result) {
                    debug(`a latest event fired`);
                    var receipt = web3.eth.getTransactionReceipt(txHash);

                    //checking receipt tx
                    //TODO: Check if a transaction is correct (GAS LIMIT!)
                    if (receipt && receipt.transactionHash == txHash) {
                        debug(`receipt transaction in block ${receipt.blockNumber}`);
                        deferred.resolve(receipt);
                        //TODO: Do a return result of the function
                        //var res = contractFunction.call();
                        
                        filter.stopWatching();
                    }
                });
                return deferred.promise;
            },
            /**
             * Function unlock default account.
             * 
             * @example unlockAccount(web3.eth.accounts[0], 'password');
             *          .then(function(txObject){
             *              console.log("%j", txObject)
             *          })
             *          .catch(function(error){
             *              console.log("%j", error);
             *          });
             */
            unlockAccount: function(){
                debug(`Starting unlockAccount function`);

                var deferred = q.defer();
                var password = accountconfig.password;
                var unlockResult = web3.personal.unlockAccount(web3.eth.defaultAccount, password);
                if(unlockResult){
                    deferred.resolve(unlockResult);
                    debug(`Default account is unlocked`);
                    return deferred.promise;
                }                
                return deferred.promise;
            }
        };            
        
    })();

    var Services = Services || (function(common){
        common.debug(`Starting Administration module.`);        
        return {
        waitTx: common.waitTx
        }
    })(Common);    
    
    return Services;
}));