/*!
 * Identify
 * Copyright(c) 2017 RosEvroBank, Anatoliy A Aksenov, Ayrat R Yakubov
 * MIT Licensed
 */

'use strict';

var q = require('q');

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
		root.Identify = factory();
	}
}(this, function () {
    /**
	 * Identify common components.
     * @private
	 */
    var Common = (function(){
        /**
         * Function for print debug information when debugging enabled.
         * For enable debug call 'export DEBUG=identify' or run server 'DEBUG=identify node server.js'
         * 
         * @param {string} Message for print
         * 
         */
        function debug(str){
          if(/IDENTIFY|Identify|identify/g.test(process.env.DEBUG)){
                    console.log(str);
          }
        }
        debug('Start common initialization');
        
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
        if (process.env.rpc_url == void 0 && process.env.RPC_URL == void 0){
            throw new Error("Environment variable 'RPC_URL' required. Call 'set RPC_URL=http://localhost:8545/' before...");
        }        
        rpc_url = process.env.rpc_url || process.env.RPC_URL;
        debug(`rpc_url: ${rpc_url}`);
        /**
         * Ethereum contract account
         * @private
         */
        var address;
        if (process.env.contract_address == void 0 && process.env.CONTRACT_ADDRESS == void 0){
            throw new Error("Environment variable 'CONTRACT_ADDRESS' required. Call 'set CONTRACT_ADDRESS=0x<ethereum contract account>' before...");
        }
        address = process.env.contract_address || process.env.CONTRACT_ADDRESS;
        debug(`address: ${address}`);
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
         * Set default contract for call smart-contract functions which use setTransaction
         */
        if((web3.eth.accounts.length == 0 || web3.eth.accounts.length > 1) && (process.env.default_contract == void 0 && process.env.DEFAULT_CONTRACT == void 0))
        {
            throw new Error("Can't get current account for call smart-contract functions. Call 'set DEFAULT_CONTRACT' before...");
        }        
        web3.eth.defaultAccount = web3.eth.accounts[0] || process.env.default_contract || process.env.DEFAULT_CONTRACT;
        debug(`Default account: ${web3.eth.defaultAccount}`);

        /**
         * ABI for Ethereum smart-contract
         * @public
         */
        var abi = require('./abi.js');
        debug(`ABI enabled.`);
        return {
            /**
             * Ethereum smart-contract interface.
             */
            abi: abi,
            /**
             * Ethereum smart-contract object.
             */
            contract: web3.eth.contract(abi).at(address),
            /**
             * Default user account 
             */
            defaultAccount: web3.eth.defaultAccount,
            /**
             * Debug function. For use call 'set DEBUG=identify' or run application 'DEBUG=identify node server.js'
             * 
             * @param {string} Message for print
             * 
             * @example common.debug('Debug message');
             */
            debug: debug
        }            
        
    })();
    
    /**
	 * Identify base components.
     * @public
	 */
    var Identify = Identify || (function(common){
        common.debug(`Starting Identify module.`);
        return {
            /**
             * User administration. Add user permissions.
             * 
             * @param {string} user ethereum address
             * 
             * @param {int} user permission.
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.AddRights( '0x4108f8299DCC126c56F0df02825F700e854b5b32', 1);
             */
            address: function(){
                var deferred = q.defer();
                common.debug(`function=<address>`);
                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }
                common.debug(common.contract.address);
                deferred.resolve(common.contract.address);                

                return deferred.promise;
            },
            AddRights: function(address, perm){
                var deferred = q.defer();

                    common.debug('function=<AddRights> address=<' + address + '> perm=<' + perm + '>');
                    if(!common.contract){
                        common.debug('Smart-contract not currently enabled.');
                        deferred.reject(new Error('Smart-contract not currently enabled.'));
                        return deferred.promise;
                    }

                    common.contract.AddRights.sendTransaction(address, perm, function(err, res){
                        if(err){
                            common.debug(`AddRights result error: ${err}`);
                            deferred.reject(new Error(err));
                        } else {
                            common.debug(`AddRights result ${res}`);
                            deferred.resolve(res);
                        }
                    });                    
                                        
                return deferred.promise;
            },
            /**
             * Giving tocken permissions.
             * 
             * @param {string} user ethereum address
             * 
             * @param {string} tocken string.
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.GiveTokenPerm( '0x4108f8299DCC126c56F0df02825F700e854b5b32', 'c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd');
             */            
            GiveTokenPerm: function(address, token){
                var deferred = q.defer();

                common.debug('function=<FiveTokenPerm> address=<' + address + '> token=<' + token + '>');
                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }
                common.contract.GiveTokenPerm.sendTransaction(address, token, function(err, res){
                    if(err){
                        common.debug(`GiveTokenPerm result error: ${err}`);
                        deferred.reject(new Error(err));
                    } else {
                        common.debug(`GiveTokenPerm result ${res}`);
                        deferred.resolve(res);
                    }
                });
                    
                return deferred.promise;
            },
            /**
             * Parties list.
             * 
             * @param {string} hash
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.PartiesList('c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd');
             */
            PartiesList: function(hash){
                var deferred = q.defer();

                common.debug(`function=<ParitesList> hash=<${hash}>`)

                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }
                
                var result = common.contract.PartiesList.call(hash);
                common.degug(`result=<${result}>`);
                deferred.resolve(result);

                return deferred.promise;                
            },
            /**
             * Adding hash.
             * 
             * @param {string} hash
             * 
             * @param {string} tocken
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.AddHash('c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd', 'd44d94fcfa245c9c6cc5c53ccda79341ba8d44a1b6e5920021fbe0dd9dfcae666653e45d5780db90521fa0114ad41de35565f6e723de292a951004eceeb89e90');
             */
            AddHash: function(hash, token){
                var deferred = q.defer();

                common.debug(`function=<AddHash> hash=<${hash}> token=<${token}>`);     

                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }           
              
                common.contract.AddHash.sendTransaction(hash, token, function(err, res){
                    if(err){
                        common.debug(`AddHash result error: ${err}`);
                        deferred.reject(new Error(err));
                    } else {
                        common.debug(`AddHash result ${res}`);
                        deferred.resolve(res);
                    }
                });

                return deferred.promise;
            },
            /**
             * Request C.
             * 
             * @param {string} hash
             * 
             * @param {string} token
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.RequestC('c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd', 'd44d94fcfa245c9c6cc5c53ccda79341ba8d44a1b6e5920021fbe0dd9dfcae666653e45d5780db90521fa0114ad41de35565f6e723de292a951004eceeb89e90');
             */
            RequestC: function(hash, token){
                var deferred = q.defer();

                common.debug(`function=<RequestC> hash=<${hash}> token=<${token}>`);   

                if(!common.contract){
                        common.debug('Smart-contract not currently enabled.');
                        deferred.reject(new Error('Smart-contract not currently enabled.'));
                        return deferred.promise;
                }             
                
                var result = common.RequestC.call(hash, token);
                common.degug(`RequestC result=<${result}>`);
                deferred.resolve(result);

                return deferred.promise;                
            },
            /**
             * Request PC.
             * 
             * @param {string} hash
             * 
             * @param {string} token
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.RequestPC('c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd', 'd44d94fcfa245c9c6cc5c53ccda79341ba8d44a1b6e5920021fbe0dd9dfcae666653e45d5780db90521fa0114ad41de35565f6e723de292a951004eceeb89e90');
             */
            RequestPC: function(hash, token){
                var deferred = q.defer();

                common.debug(`function=<RequestPC> hash=<${hash}> token=<${token}>`);     

                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }           
               
                var result = common.contract.RequestPC.call(hash, token);
                common.degug(`RequestPC result=<${result}>`);
                deferred.resolve(result);
                
                return deferred.promise;
            },
            /**
             * Request data.
             * 
             * @param {string} hash
             * 
             * @param {string} token
             * 
             * @return {string} tx number.
             * 
             * @example var tx = Identify.Request('c3053184574070770f574018a6681e549f6b92a658528ad8f14d6a66c2f9a72ba99e64175d4cc920b8be66a66c2d66756f523c2b3cd6ee3534d0fd67b96c65cd', 'd44d94fcfa245c9c6cc5c53ccda79341ba8d44a1b6e5920021fbe0dd9dfcae666653e45d5780db90521fa0114ad41de35565f6e723de292a951004eceeb89e90');
             */
            Request: function(hash, token){
                var deferred = q.defer();

                common.debug(`function=<Request> hash=<${hash}> token=<${token}>`);            

                if(!common.contract){
                    common.debug('Smart-contract not currently enabled.');
                    deferred.reject(new Error('Smart-contract not currently enabled.'));
                    return deferred.promise;
                }    
                common.contract.Request.sendTransaction(hash, token, function(err, res){
                    if(err){
                        common.debug(`Request result error: ${err}`);
                        deferred.reject(new Error(err));
                    } else {
                        common.debug(`Request result ${res}`);
                        deferred.resolve(res);
                    }
                });

                return deferred.promise;
            }
        }
    })(Common);

    return Identify;
}));