import { ethers } from "@nomiclabs/buidler";
require("dotenv").config();

async function main() {
  const teaPartyFactory = await ethers.getContract("TeaParty");

  // If we had constructor arguments, they would be passed into deploy()
  let teaFactoryContract = await teaPartyFactory.deploy(
    process.env.CHAI_ADDRESS,
    process.env.DAI_ADDRESS,
    process.env.BENEFICIARY
  );

  // The address the Contract WILL have once mined
  console.log("TCL: main -> teaFactoryContract.address", teaFactoryContract.address);
  console.log(
    "TCL: main -> teaFactoryContract.deployTransaction.hash",
    teaFactoryContract.deployTransaction.hash
  );

  // The contract is NOT deployed yet; we must wait until it is mined
  await teaFactoryContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
