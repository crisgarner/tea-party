import { ethers } from "@nomiclabs/buidler";
require("dotenv").config();

async function main() {
  const membershipFactory = await ethers.getContract("Membership");

  let membershipContract = await membershipFactory.deploy(process.env.TEA_ADDRESS);

  // The address the Contract WILL have once mined
  console.log("TCL: main -> membershipContract.address", membershipContract.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(
    "TCL: main -> membershipContract.deployTransaction.hash",
    membershipContract.deployTransaction.hash
  );
  // The contract is NOT deployed yet; we must wait until it is mined
  await membershipContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
