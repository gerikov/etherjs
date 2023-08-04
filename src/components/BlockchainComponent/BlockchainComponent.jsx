import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function BlockchainComponent() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // Connect to an Ethereum provider (e.g., Infura)
    // const infuraApiKey = 'YOUR_INFURA_API_KEY';
    const infuraProvider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/38a91243157a4bdc9f95e36e69bc8211`
    );

    setProvider(infuraProvider);
  }, []);

  const fetchBlockchainData = async () => {
    if (provider) {
      // Example: Fetch Ethereum block number
      const blockNumber = await provider.getBlockNumber();
      console.log('Current Block Number:', blockNumber);
    }
  };

  return (
    <div>
      <h2>Ethers.js and Ethereum</h2>
      <button onClick={fetchBlockchainData}>Fetch Blockchain Data</button>
    </div>
  );
}

export default BlockchainComponent;
