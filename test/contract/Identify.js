/*!
 * Identify
 * Copyright(c) 2017 RosEvroBank, Anatoliy A Aksenov, Ayrat R Yakubov
 * MIT Licensed
 */

'use strict';

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
         * Initial Web3 
         * @private
         */
        var web3 = {};
        try {
            var Web3 = require('web3');
            web3 = new Web3();
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

        /**
         * Ethereum contract account
         * @private
         */
        var address;
        if (process.env.contract_address == void 0 && process.env.CONTRACT_ADDRESS == void 0){
            throw new Error("Environment variable 'CONTRACT_ADDRESS' required. Call 'set CONTRACT_ADDRESS=0x<ethereum contract account>' before...");
        }
        address = process.env.contract_address || process.env.CONTRACT_ADDRESS;

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
        
        /**
         * Set default contract for call smart-contract functions which use setTransaction
         */
        if((web3.eth.accounts.length == 0 || web3.eth.accounts.length > 1) && (process.env.default_contract == void 0 && process.env.DEFAULT_CONTRACT == void 0))
        {
            throw new Error("Can't get current account for call smart-contract functions. Call 'set DEFAULT_CONTRACT' before...");
        }        
        web3.eth.defaultAccount = web3.eth.accounts[0] || process.env.default_contract || process.env.DEFAULT_CONTRACT;
        
        /**
         * ABI for Ethereum smart-contract
         * @public
         */
        var abi = require('./abi.js');

        return {
            /**
             * Ethereum smart-contract interface.
             */
            abi:            abi,
            /**
             * Ethereum smart-contract object.
             */
            contract:       web3.eth.contract(abi).at(address),
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
            debug: function(str){
                if(/IDENTIFY|Identify|identify/g.test(process.env.DEBUG)){
                    console.log(str);
                }
            }
        }
    });

    /**
	 * Identify base components.
     * @public
	 */
    var Identify = Base || (function(common){
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
            AddRights: function(address, perm){
                common.debug('function=<AddRights> address=<' + address + '> perm=<' + perm + '>');
                if(!!common.contract){
                    var result = common.contract.AddRights.sendTransaction(address, perm);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<AddRights> ends with null result`);
                return null;
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
                common.debug('function=<FiveTokenPerm> address=<' + address + '> token=<' + token + '>');
                if(!!common.contract){
                    var result = common.contract.GiveTokenPerm.sendTransaction(address, token);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<GiveTockenPerm> ends with null result`);
                return null;
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
                common.debug(`function=<ParitesList> hash=<${hash}>`)
                if (!!common.contract){
                    var result = common.contract.PartiesList.call(hash);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<ParitesList> ends with null result`);
                return null;
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
                common.debug(`function=<AddHash> hash=<${hash}> token=<${token}>`);                
                if(!!common.contract){
                    var result = pilot.AddHash.sendTransaction(hash, token);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<AddHash> ends with null result`);
                return null;
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
                common.debug(`function=<RequestC> hash=<${hash}> token=<${token}>`);                
                if (!!common.contract){
                    var result = common.RequestC.call(hash, token);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<RequestC> ends with null result`);
                return null;
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
                common.debug(`function=<RequestPC> hash=<${hash}> token=<${token}>`);                
                if (!!common.contract){
                    var result = common.contract.RequestPC.call(hash, token);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<RequestPC> ends with null result`);                
                return result;
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
                common.debug(`function=<Request> hash=<${hash}> token=<${token}>`);                
                if (!!common.contract){
                    var result = common.contract.Request.sendTransaction(hash, token);
                    common.degug(`result=<${result}>`);
                    return result;
                }
                common.debug(`function=<Request> ends with null result`);
                return null;
            }
        }
    })(Common);

    return Identify;
}));