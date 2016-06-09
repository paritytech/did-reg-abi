var abi = require('./abi.json');
var addresses = require('./adresses');

module.exports = function nameReg(web3, nameRegAddress) {
    var address = nameRegAddress || addresses[web3.version.network];

    if (!address) {
      var zero = '0x0000000000000000000000000000000000000000';
      return {
        contract: null,
        getRegistryPrimary: function () {
          return zero;
        },
        getReverseRegistry: function () {
          return '';
        }
      };
    } 

    var contract = web3.eth
      .contract(abi)
      .at(address);
    return {
      contract: contract,
      getRegistryPrimary: function () {
        return contract.getRegistryPrimary.apply(contract, arguments);
      },
      getReverseRegistry: function () {
        var hex = contract.reverseRegistry.apply(contract, arguments);
        return hex.substr(2).replace(/.{2}/g, function (v) {
          if (v == '00') return '';
          return String.fromCharCode(parseInt(v, 16));
        });
      }
    };
}

