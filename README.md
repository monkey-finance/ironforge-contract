# Iron Forge Contract

**Synths on Binance Smart Chain**

## Licensing

## verify

```shell script

upgrade的合约并不会在development里面生成，不能方便的去verify

yarn hardhat verify  --network heco-testnet 0xf537a61A1c58F7d85FbDC488795508e2F1640c00

# 这个是代理合约验证不了，需要验证implement合约，该合约在 https://testnet.bscscan.com/proxyContractChecker?a=0xb7E49284056fd1707290276bd3dbDB28dAA1b921
yarn hardhat verify  --network bsc-testnet 0xb7E49284056fd1707290276bd3dbDB28dAA1b921
# 验证真实的合约
yarn hardhat verify  --network bsc-testnet 0xee241630c8c860c593c0fc1bc1e49fa5981fc24e
# 验证后的合约可以看到代码：https://testnet.bscscan.com/address/0xee241630c8c860c593c0fc1bc1e49fa5981fc24e#code

```

## initial tasks

### add stake pool: BS 催化剂

NODE_ENV=test yarn hardhat a-addPool --alloc-point 1 --if-lock true --start-block 0 --token-address 0xFd9a847dD5e37e40DAa573a32fe43058f5018ad1

### add stake pool: BS 单币

NODE_ENV=test yarn hardhat a-addPool --alloc-point 3 --if-lock true --start-block 0 --token-address 0x8FD06E016b130b8e2a517d9DC1FF10899508B14b

### add stake pool: USDC-BST

NODE_ENV=test yarn hardhat a-addPool --alloc-point 1 --if-lock true --start-block 0 --token-address 0xe35f1F3d7CF97738CC3F455692Fd7FF49AB18b07

### add stake pool: USDC-ETH

NODE_ENV=test yarn hardhat a-addPool --alloc-point 1 --if-lock true --start-block 0 --token-address 0xECC1495C8640aA34cF2403135d382E5a4C468ECA
