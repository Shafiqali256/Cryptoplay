import { ethers } from 'ethers';

// Mock ethers provider
jest.mock('ethers', () => ({
  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 5 }),
      getBalance: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000'))
    })),
    InfuraProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: 5 }),
      getBalance: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000'))
    }))
  },
  Wallet: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    getBalance: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000')),
    sendTransaction: jest.fn().mockResolvedValue({
      hash: '0x123',
      wait: jest.fn().mockResolvedValue({
        transactionHash: '0x123',
        blockNumber: 123,
        from: '0x123',
        to: '0x456',
        status: 1
      })
    }),
    address: '0x123'
  })),
  Contract: jest.fn().mockImplementation(() => ({
    balanceOf: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000')),
    tokenOfOwnerByIndex: jest.fn().mockResolvedValue(ethers.BigNumber.from('1')),
    tokenURI: jest.fn().mockResolvedValue(JSON.stringify({
      name: 'Test NFT',
      description: 'Test description',
      attributes: [{ trait_type: 'Test', value: 'Value' }]
    }))
  })),
  ContractFactory: jest.fn().mockImplementation(() => ({
    deploy: jest.fn().mockResolvedValue({
      address: '0x123',
      balanceOf: jest.fn().mockResolvedValue(ethers.BigNumber.from('1000000000000000000')),
      tokenOfOwnerByIndex: jest.fn().mockResolvedValue(ethers.BigNumber.from('1')),
      tokenURI: jest.fn().mockResolvedValue(JSON.stringify({
        name: 'Test NFT',
        description: 'Test description',
        attributes: [{ trait_type: 'Test', value: 'Value' }]
      }))
    })
  })),
  utils: {
    formatEther: jest.fn().mockImplementation((value) => value.toString()),
    parseEther: jest.fn().mockImplementation((value) => ethers.BigNumber.from(value))
  },
  BigNumber: {
    from: jest.fn().mockImplementation((value) => ({
      toNumber: jest.fn().mockReturnValue(Number(value))
    }))
  }
})); 