pragma solidity ^0.4.10;
import "Ownable.sol";
import "Administrator.sol";
import "idStorage.sol";
contract IDChain is Ownable {
    /* Public variables of the token */
//    address  public owner;
    address  public partiesContract;
    address  public storageContract;
//    uint     public inc;
    
    struct customer {
        address  party;
        bool   isCustomerValid;
    }
    
    //Data store
    idStorage public idstorage;
    Administrator public admin;
    
    //mapping (bytes32  => mapping (bytes32 => address )) public MHash1;
    //mapping (address  => mapping (bytes32 => bool    )) public MTokenPerm;
    
    event EAnswer(address _to, bytes32 _token, bool _result);
    event EIdentified();
    event ETokenGiven(address _to, bytes32 _token);
    
    /* Initialization*/
    function IDChain() {
    }
    
    
    function SetPartiesContract(address _address) onlyOwner {
        partiesContract = _address;
        admin = Administrator(partiesContract);
    }
    function SetStorageContract(address _address) onlyOwner {
        storageContract = _address;
        idstorage = idStorage(_address);
    }

    function GetPartyRole(address _address) private constant returns (uint8){
        admin = Administrator(partiesContract);
        return admin.GetParticipantRole(_address);
    }
    
    function addCustomerHash(bytes32 _token, bytes32 _hash) returns (bool result){
        //bool result = false;
        uint8 crole = GetPartyRole(msg.sender);
        
        if ( crole == 0 || crole == 1 || crole == 3){
            return false;
        }
        if (_token.length == 0 || _hash.length ==0){
            return false;
        }
        //MHash1[_token][_hash1] = msg.sender;
        idstorage.setParticipantHash(_token, _hash, msg.sender, true);
        
        return true;
    }
    
    function GiveTokenPerm(address _address, bytes32 _token) returns (bool result){
        uint8 crole = GetPartyRole(msg.sender);
        if (_address == msg.sender){
            return false;
        }
        if (crole == 0 || crole == 1 || crole == 3){
            return false;
        }
        //MTokenPerm[_address][_token] = true;
        idstorage.setTokenPermission(_address, _token, true);
        return true;
    }
    
    function TokenGiven(address _to, bytes32 _token){
        ETokenGiven(_to, _token);
    }
    
    function Identified(bytes32 _token, bytes32 _hash) returns (bool){
        EIdentified();
    }
    
    function RequestP(bytes32 _token, bytes32 _hash) returns(bool hres1){
        if (!idstorage.getTokenPermission(msg.sender, _token)){
            return;
        }
        if (   idstorage.getParticipantHashAddress(_token, _hash) != address(0x0) 
            && idstorage.getParticipantHashBool(_token, _hash)
           ){
            hres1 = true;
            Identified(_token, _hash);
        } else
        {   hres1 = false;
        }
    }
    
    function RequestC(bytes32 _token, bytes32 _hash) constant
    returns(bool hres){
        if (   idstorage.getParticipantHashAddress(_token, _hash) != address(0x0) 
            && idstorage.getParticipantHashBool(_token, _hash)
           ){
            hres = true;
        } else
        {   hres = false;
        }
    }

    function RequestTest(bytes32 _token, bytes32 _hash) constant
    returns(address, bool){
        return (idstorage.getParticipantHashAddress(_token, _hash), 
            idstorage.getParticipantHashBool(_token, _hash) 
           );
    }

    
    function Request(bytes32 _token, bytes32 _hash) 
    returns(bool hres1){
        bool _result;
        if (   idstorage.getParticipantHashAddress(_token, _hash) != address(0x0) 
            && idstorage.getParticipantHashBool(_token, _hash)
           ){
            hres1 = true;
        } else
        {   hres1 = false;
        }
        
        //MTokenPerm[msg.sender][_token] = false;
        idstorage.setTokenPermission(msg.sender, _token, false);
        EAnswer(msg.sender, _hash, _result);
    }
   
    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}