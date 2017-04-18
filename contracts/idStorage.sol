pragma solidity ^0.4.10;
import "Ownable.sol";
contract idStorage is Ownable{
    function EternalStorage(){
    }
    struct customer {
        address  party;
        bool   isCustomerValid;
    }
    
    //Data store
    mapping (bytes32  => mapping (bytes32 => customer )) public mHash;
    mapping (address  => mapping (bytes32 => bool    )) public mTokenPerm;
    
    function setParticipantHash(bytes32 _token, bytes32 hash, address _address, bool _isValid) onlyOwner{
        mHash[_token][hash].party = _address;
        mHash[_token][hash].isCustomerValid = _isValid;
    }
    
    function getParticipantHashAddress(bytes32 _token, bytes32 hash) constant returns (address) {
        return mHash[_token][hash].party;
    }
    
    function getParticipantHashBool(bytes32 _token, bytes32 hash) constant returns (bool) {
        return mHash[_token][hash].isCustomerValid;
    }
    
    function setTokenPermission(address _address, bytes32 _token, bool _bool) onlyOwner{
        mTokenPerm[_address][_token] = _bool;
    }
    
    function getTokenPermission(address _address, bytes32 _token) constant returns(bool){
        return mTokenPerm[_address][_token];
    }
    
}