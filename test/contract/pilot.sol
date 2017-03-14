pragma solidity ^0.4.8;
contract Parties {
    address public owner;
    address public idChain;
    uint public it;
    
    // ROLE: 0 - don't exist, 1 - can do nothing, 2 - can do everything, 3 - only requests, 4 - only add
    struct Party {
        string  Name;
        uint8   Role;
        string  URL;
    }
    
    mapping (address => Party) public MParties;
    
    address[] public AParties;
    //mapping (address => string) public MName;
    
    function Parties (){
        owner = msg.sender;
    }
    
    function SetIDChain(address _address) returns (bool){
        if (msg.sender != owner){
            return false;
        }
        idChain = _address;
    }
    
    function Add(address _address, string _name, uint8 _role, string _url) returns (bool){
        if (msg.sender != owner){
            return false;
        }
        bool exst = false;
        for (uint i = 0; i < AParties.length; i++){
            if (AParties[i] == _address){
                exst = true;
            }
        }
        if (!exst){
            Party memory _party;
            //_party.Name    = _name;
            //_party.Role    = _role;
            //_party.URL     = _url;
            MParties[_address] = Party(_name, _role, _url);
            AParties.push(_address);
            //MName[_address]=_name;
        }
    }
    
    function Remove (address _address) returns(bool){
        uint index;
        if (msg.sender != owner){
            return false;
        }
        for (uint i = 0; i < AParties.length; i++){
            if (AParties[i] == _address){
                index = i;
            }
        }
        
        for (uint j = index; j< AParties.length-1; j++){
            AParties[j] = AParties[j+1];
        }
        delete AParties[AParties.length-1];
        AParties.length--;
        return true;
    }
    
    function SetRole(address _address, uint8 _role) returns (bool){
        if (msg.sender != owner){
            return false;
        }
        if (MParties[_address].Role == 0 || ((_role != 1) && (_role != 2) && (_role !=3))){
            return false;
        }
        MParties[_address].Role = _role;
    }
    
    function GetRole(address _address) constant returns (uint8){
        if (msg.sender != idChain){
            return;
        }
        return MParties[_address].Role; 
    }
    
    function SetURL(address _address, string _url) returns (bool){
        if (msg.sender != owner){
            return false;
        }
        MParties[_address].URL = _url;
    }
    
    function GetURL(address _address) constant returns (string){
        if (msg.sender != idChain){
            return;
        }
        return MParties[_address].URL;
    }
    
    function List() constant returns (address[]){
        return AParties;
    }
    
    function GetName(address _address) constant returns ( string _name){
        return MParties[_address].Name;
    }
    
}

contract IDChain {
    /* Public variables of the token */
    address  public owner;
    address  public partiesContract;
    uint     public inc;
    
    //Data store
    mapping (bytes32  => mapping (bytes32 => address )) public MHash1;
    mapping (address  => mapping (bytes32 => bool    )) public MTokenPerm;
    
    event EAnswer(address _to, bytes32 _token, bool _result);
    event EIdentified();
    event ETokenGiven(address _to, bytes32 _token);
    
    /* Initialization*/
    function IDChain() {
        owner = msg.sender;
    }
    
    function SetPartiesContract(address _address) returns (bool){
        if (msg.sender != owner){
            return false;
        }
        partiesContract = _address;
    }
    
    function GetPartyRole(address _address) private returns (uint8){
        Parties CParty = Parties(partiesContract);
        return CParty.GetRole(_address);
        
    }
    
    function AddHash(bytes32 _token, bytes32 _hash1) returns (bool result){
        //bool result = false;
        uint8 crole = GetPartyRole(msg.sender);
        
        if ( crole == 0 || crole == 1 || crole == 3){
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
        uint8 crole = GetPartyRole(msg.sender);
        if (_address == msg.sender){
            return false;
        }
        if (crole == 0 || crole == 1 || crole == 3){
            return false;
        }
        MTokenPerm[_address][_token] = true;
        return true;
    }
    
    function TokenGiven(address _to, bytes32 _token){
        ETokenGiven(_to, _token);
    }
    
    function Identified(bytes32 _token, bytes32 _hash) returns (bool){
        EIdentified();
    }
    
    function RequestP(bytes32 _token, bytes32 _hash1) returns(bool hres1){
        if (!MTokenPerm[msg.sender][_token]){
            return;
        }
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
            Identified(_token, _hash1);
        } else
        {   hres1 = false;
        }
    }
    
    function RequestC(bytes32 _token, bytes32 _hash1) constant
    returns(bool hres1){
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
        } else
        {   hres1 = false;
        }
    }

    
    function Request(bytes32 _token, bytes32 _hash1) 
    returns(bool hres1){
        bool _result;
        if (MHash1[_token][_hash1] != address(0x0)){
            hres1 = true;
        } else
        {   hres1 = false;
        }
        
        MTokenPerm[msg.sender][_token] = false;
        EAnswer(msg.sender, _hash1, _result);
    }
   
    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}
