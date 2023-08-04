import { Chain } from 'wagmi';

export const torus = {
  id: 8194,
  name: 'Torus',
  network: 'Tours',
  nativeCurrency: {
    decimals: 18,
    name: 'Torus',
    symbol: 'qTF',
  },
  rpcUrls: {
    public: { http: ['http://rpc-horn.toruspad.org:18545'] },
    default: { http: ['http://rpc-horn.toruspad.org:18545'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.toruspad.org/',
    },
    default: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.toruspad.org/',
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
} as const satisfies Chain;
