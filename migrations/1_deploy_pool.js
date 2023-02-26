const Pool = artifacts.require("Pool");
// const Swap = artifacts.require("Swap");

module.exports = function (deployer) {
  deployer.deploy(Pool);
  // deployer.deploy(Swap);
};
