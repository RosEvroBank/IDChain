pragma solidity ^0.4.4;
//import "https://github.com/ethereum/dapp-bin/library/stringUtils.sol";
contract pilot {
    /* Public variables of the token */
    address  public owner;
    uint     public inc;
    bytes32  public hash1;
    bytes32  public hash2;
    bytes32  public hash3;
    bytes32  public token;
    address  public add;
    
    //Data store
    mapping (bytes32  => mapping (bytes32 => address )) public MHash1;
    mapping (bytes32  => mapping (bytes32 => address )) public MHash2;
    mapping (bytes32  => mapping (bytes32 => address )) public MHash3;
    mapping (address  => mapping (bytes32 => bool    )) public MTokenPerm;
    
    //Administration
    // 0 - don't exist, 1 - can do nothing, 2 - can do everything, 3 - only requests, 4 - only add
    mapping (address  => uint8) public MAdmin;
    
    //List of parties for customer
    mapping (bytes32  => address[]) public MProfileParties;
    mapping (bytes32  => uint8 ) public MProfileRating;    
    
    //Consortium parties
    address[] AParties;
    
    event Answer(address _to, bytes32 _token, bool _result);
    
    
    /* Initialization*/
    function pilot() {
        owner = msg.sender;
    }
    
    function AddRights(address _address, uint8 _perm) returns (bool _result){
        if (msg.sender != owner){
            return false;
        }
        if (_perm == 0){
            return false;
        }
        MAdmin[_address] = _perm;
        
        if (_perm == 2 || _perm == 3 || _perm == 4){
        AParties.push(_address);
        //To do: Create function add with check if exist;
        }
        if (_perm == 0 || _perm == 1){
        //To do: Create function delete from array    
        }
        
    }
    
    function GetPartyPerm(address _address) constant returns (uint8){
        if (msg.sender != owner){
            return;
        }
        return MAdmin[_address];
    }
    
    function PartiesList(bytes32 _hash1) constant returns(address[] result){
        return MProfileParties[_hash1];
    }
    
    function AddHash(bytes32 _hash1, bytes32 _token) returns (bool result){
        //bool result = false;
        
        if (MAdmin[msg.sender] == 0 ||MAdmin[msg.sender] == 1 || MAdmin[msg.sender] == 3){
            return false;
        }
        if (_token.length == 0 || _hash1.length ==0){
            return false;
        }
        MHash1[_token][_hash1] = msg.sender;
        inc= 1;
        
        return true;
    }
    
    function GiveTokenPerm(address _address, bytes32 _token) returns (bool result){
        if (MAdmin[msg.sender] == 0 ||MAdmin[msg.sender] == 1 || MAdmin[msg.sender] == 3){
            return false;
        }
        MTokenPerm[_address][_token] = true;
        return true;
    }
    
    function RequestPC(bytes32 _hash1, bytes32 _token) constant
    returns(bool hres1){
        if (!MTokenPerm[msg.sender][_token]){
            return;
        }
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
        } else
        {   hres1 = false;
        }
    }
    
    function RequestC(bytes32 _hash1, bytes32 _hash2, bytes32 _hash3, bytes32 _token) constant
    returns(bool hres1){
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
        } else
        {   hres1 = false;
        }
    }

    
    function Request(bytes32 _hash1, bytes32 _hash2, bytes32 _hash3, bytes32 _token) 
    returns(bool hres1){
        bool _result;
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
        } else
        {   hres1 = false;
        }
        
        MTokenPerm[msg.sender][_token] = false;
        Answer(msg.sender, _hash1, _result);
    }
   
    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}