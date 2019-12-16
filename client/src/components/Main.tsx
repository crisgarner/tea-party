import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import { Button, Container, FormGroup, Label, Input } from "reactstrap";
import { addressShortener, getEns } from "../utils/utils";
import { getRoles } from "@testing-library/react";

type props = {
  teaParty: ethers.Contract;
  membership: ethers.Contract;
  web3Provider: ethers.providers.Web3Provider;
  account: string;
  chai: ethers.Contract;
  dai: ethers.Contract;
};

export const Main = ({ teaParty, membership, web3Provider, account, dai, chai }: props) => {
  const shortAddress = addressShortener(account);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(shortAddress);
  const [owner, setOwner] = useState("");
  const [daiBalance, setDaiBalance] = useState("0");
  const [stake, setStake] = useState("0");
  const [chaiBalance, setChaiBalance] = useState("0");
  const [tdaiBalance, setTDaiBalance] = useState("0");
  const [tchaiBalance, setTChaiBalance] = useState("0");

  const getRole = async () => {
    const role = await membership.getRole(account);
    alert(role);
  };

  const approveAmount = async () => {
    let fullBalance = utils.parseEther(amount);
    const receipt = await dai.approve(process.env.REACT_APP_TEA_ADDRESS, fullBalance);
    if (receipt) {
      alert("success, refresh page after confirmation");
    }
  };

  const stakeAmount = async () => {
    let fullBalance = utils.parseEther(amount);
    const receipt = await teaParty.stakeDai(fullBalance);
    if (receipt) {
      alert("success, refresh page after confirmation");
    }
  };

  const removeStake = async () => {
    const receipt = await teaParty.retrieveStake();
    if (receipt) {
      alert("success, refresh page after confirmation");
    }
  };

  const retrieveFunds = async () => {
    const receipt = await teaParty.retrieveFunds();
    if (receipt) {
      alert("success, refresh page after confirmation");
    }
  };

  useEffect(() => {
    async function fetchShortAddress() {
      const tempAddress = await getEns(account);
      if (tempAddress) {
        setAddress(tempAddress);
      }
    }

    async function fetchOwner() {
      let owner = await teaParty.owner();
      setOwner(owner);
    }

    async function fetchStake() {
      let currentStake = await teaParty.userToStake(account);
      let stake = utils.formatEther(currentStake.toString()).toString();
      setStake(stake);
    }

    async function fetchDAI() {
      let daiBalance = await dai.balanceOf(account);
      let fullBalance = utils.formatEther(daiBalance.toString()).toString();
      setDaiBalance(fullBalance);
    }

    async function fetchCHAI() {
      let chaiBalance = await chai.balanceOf(account);
      let fullBalance = utils.formatEther(chaiBalance.toString()).toString();
      setChaiBalance(fullBalance);
    }

    async function fetchTDAI() {
      let daiBalance = await dai.balanceOf(process.env.REACT_APP_TEA_ADDRESS);
      let fullBalance = utils.formatEther(daiBalance.toString()).toString();
      setTDaiBalance(fullBalance);
    }

    async function fetchTCHAI() {
      let chaiBalance = await chai.balanceOf(process.env.REACT_APP_TEA_ADDRESS);
      let fullBalance = utils.formatEther(chaiBalance.toString()).toString();
      setTChaiBalance(fullBalance);
    }

    fetchOwner();
    fetchStake();
    fetchShortAddress();
    fetchDAI();
    fetchCHAI();
    fetchTDAI();
    fetchTCHAI();
  }, [owner, address, daiBalance, chaiBalance, tchaiBalance, tdaiBalance]);

  return (
    <Container className="main">
      <h1>{address}</h1>
      {account === owner ? (
        <>
          <h4>Beneficiary</h4>
          <Button className="primary" onClick={retrieveFunds}>
            Retrieve Funds
          </Button>
        </>
      ) : (
        <p>Normal Account</p>
      )}
      <div className="balances mt-4">
        <h3>Balances</h3>
        <h5>DAI: {daiBalance}</h5>
        <h5>CHAI: {chaiBalance}</h5>
      </div>
      <div className="membership mt-4">
        <h3>Memberships</h3>
        <p>{process.env.REACT_APP_MEMBERSHIP_ADDRESS}</p>
        <Button className="primary" onClick={getRole}>
          Get Role
        </Button>
        <Button className="primary">Add Role</Button>
        <Button className="primary">Update Role</Button>
      </div>
      <div className="tea-party mt-4">
        <h3>Tea Party</h3>
        <p>{process.env.REACT_APP_TEA_ADDRESS}</p>
        <h5>DAI: {tdaiBalance}</h5>
        <h5>CHAI: {tchaiBalance}</h5>
        <h5>Current Stake: {stake} DAI</h5>
        <FormGroup>
          <Label for="Amount">Amount</Label>
          <Input
            type="text"
            name="amount"
            id="amount"
            value={amount}
            placeholder="Amount to Stake"
            onChange={e => {
              setAmount(e.target.value);
            }}
          />
        </FormGroup>
        <div className="tea-buttons">
          <Button className="primary" onClick={approveAmount}>
            Approve
          </Button>
          <Button className="primary" onClick={stakeAmount}>
            Stake
          </Button>
          <Button className="primary" onClick={removeStake}>
            Remove Stake
          </Button>
        </div>
      </div>
    </Container>
  );
};
