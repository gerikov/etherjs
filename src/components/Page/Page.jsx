import { useCallback, useEffect, useState } from 'react';
import Button from '../Button/Button';
import styles from './Page.module.scss';
import { ethers, JsonRpcProvider } from 'ethers';

const SMART_CONTRACT_ADDRESS = '0xfc00face00000000000000000000000000000000';
import contractAbi from '../abi.json';

const Page = () => {
  const [provider, setProvider] = useState(null);
  const [customProvider, setCustomProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [verified, setVerified] = useState(false);
  const [blockchainData, setBlockchainData] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        const customProvider = new JsonRpcProvider(
          'https://rpc-horn.toruspad.org'
        );
        setCustomProvider(customProvider);
        // const provider = new ethers.JsonRpcProvider(
        //   'https://rpc-horn.toruspad.org'
        // );
        setProvider(provider);
      } else {
        console.log('Need to install metamask');
        setProvider(ethers.getDefaultProvider());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const [connectedAccount, setConnectedAccount] = useState('');
  useEffect(() => {
    const initialCheck = async () => {
      try {
        const initialAccounts = await provider?.listAccounts();
        if (initialAccounts?.length > 0) {
          const initialAccount = initialAccounts[0];
          setConnectedAccount(initialAccount.address);
        }
      } catch (error) {
        console.error('Error fetching initial accounts:', error);
      }
    };

    initialCheck();

    window.ethereum.on('accountsChanged', (newAccounts) => {
      if (newAccounts.length > 0) {
        const newAccount = newAccounts[0];
        setConnectedAccount(newAccount);
        console.log('User switched to new account:', newAccount);
      } else {
        setConnectedAccount('');
        console.log('User disconnected their wallet');
      }
    });

    return () => {
      window.ethereum.removeAllListeners('accountsChanged');
    };
  }, [provider]);

  const verifyWallet = useCallback(async () => {
    const message = 'sign into ethers.org?';

    // Signing the message
    const sig = await signer.signMessage(message);
    const result = ethers.verifyMessage(message, sig);
    setVerified(result === signer.address);
  }, [signer]);

  const fetchBlockchainData = useCallback(async () => {
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(connectedAccount);
    const customBalance = await customProvider.getBalance(connectedAccount);

    setBlockchainData({ blockNumber, balance, customBalance });
  }, [provider, connectedAccount, customProvider]);

  useEffect(() => {
    fetchBlockchainData();
  }, [fetchBlockchainData]);

  const fetchContractValue = useCallback(async () => {
    console.log(signer);
    const contract = new ethers.Contract(
      SMART_CONTRACT_ADDRESS,
      contractAbi,
      signer
    );
    try {
      const value = await contract.lastValidatorID();
      console.log('Contract Value:', value.toString());
    } catch (error) {
      console.error('Error fetching contract value:', error);
    }
  }, [signer]);

  useEffect(() => {
    fetchContractValue();
  }, [fetchContractValue]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Button text={'Connect Metamask'} onClick={fetchWallet} />
        {connectedAccount && (
          <div>
            <span>Connected wallet: </span>
            <span>{connectedAccount}</span>
          </div>
        )}
        <button onClick={fetchBlockchainData}>Get Blockchain Data</button>
        {blockchainData && (
          <>
            <div className={styles.data}>
              Block number: {blockchainData?.blockNumber}
            </div>
            <div className={styles.data}>
              Current chain Balance:{' '}
              {ethers.formatEther(blockchainData?.balance)}
            </div>
            <div className={styles.data}>
              Torus Balance:
              {ethers.formatEther(blockchainData?.customBalance)}
            </div>
          </>
        )}
        <button onClick={verifyWallet}>Verify wallet</button>
        {verified && <div>Your wallet is verified</div>}
      </div>
    </div>
  );
};
export default Page;
