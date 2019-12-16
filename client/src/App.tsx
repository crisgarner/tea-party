import React, { useState } from "react";
import "./App.scss";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import TeaParty from "./contracts/TeaParty.json";
import Membership from "./contracts/Membership.json";
import ERC20 from "./contracts/ERC20.json";
import { Main } from "./components/Main";
import { Container } from "reactstrap";

const App: React.FC = () => {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();

  let setAccounts = async (provider: ethers.providers.Web3Provider) => {
    const accounts = await provider?.listAccounts();
    setAccount(accounts[0]);
  };

  if (account) {
    var signer = provider.getSigner();
    let teaParty = new ethers.Contract(
      process.env.REACT_APP_TEA_ADDRESS as string,
      TeaParty.abi,
      signer
    );
    let membership = new ethers.Contract(
      process.env.REACT_APP_MEMBERSHIP_ADDRESS as string,
      Membership.abi,
      signer
    );
    let dai = new ethers.Contract(process.env.REACT_APP_DAI_ADDRESS as string, ERC20.abi, signer);
    let chai = new ethers.Contract(
      process.env.REACT_APP_CHAI_ADDRESS as string,
      //@ts-ignore
      ERC20.abi,
      signer
    );

    //TODO create components and pass account, signer and contracts
    return (
      <Main
        teaParty={teaParty}
        membership={membership}
        account={account}
        web3Provider={provider}
        dai={dai}
        chai={chai}
      ></Main>
    );
  }

  return (
    <Container className="initial">
      <Web3Connect.Button
        network="kovan" // optional
        providerOptions={{
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: process.env.REACT_APP_INFURA_ID // required
            }
          }
        }}
        onConnect={async (networkProvider: ethers.providers.Web3Provider) => {
          let provider = new ethers.providers.Web3Provider(networkProvider);
          setProvider(provider);
          setAccounts(provider);
        }}
        onClose={() => {
          console.log("Web3Connect Modal Closed"); // modal has closed
        }}
      />
    </Container>
  );
};

export default App;
