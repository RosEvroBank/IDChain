/*!
 * ABI for Admin Ethereum smart-contract
 * Copyright(c) 2017 RosEvroBank, Anatoliy A Aksenov, Ayrat R Yakubov
 * MIT Licensed
 */

var idContract = [{"constant":false,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"Request","outputs":[{"name":"hres1","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_token","type":"bytes32"}],"name":"GiveTokenPerm","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"storageContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"name":"MHash1","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"RequestP","outputs":[{"name":"hres1","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"SetAdminContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"RequestTest","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"partiesContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"MTokenPerm","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"SetStorageContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"Identified","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"addCustomerHash","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"bytes32"},{"name":"_hash","type":"bytes32"}],"name":"RequestC","outputs":[{"name":"hres","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"GetPartyRole","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_token","type":"bytes32"}],"name":"TokenGiven","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_token","type":"bytes32"},{"indexed":false,"name":"_result","type":"bool"}],"name":"eAnswer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"bytes32"},{"indexed":false,"name":"hash","type":"bytes32"}],"name":"eIdentified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_token","type":"bytes32"}],"name":"eTokenGiven","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_token","type":"bytes32"},{"indexed":false,"name":"_hash","type":"bytes32"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_role","type":"uint8"}],"name":"eAddCustomerHash","type":"event"}];
module.exports = idContract;