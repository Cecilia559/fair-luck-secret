/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const FHERaffleAddresses = { 
  "11155111": { address: "0x0000000000000000000000000000000000000000", chainId: 11155111, chainName: "sepolia" },
  "31337": { address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", chainId: 31337, chainName: "hardhat" },
};

/**
 * Get contract address for a given chain ID
 * @param chainId - The chain ID (e.g., 31337 for Hardhat, 11155111 for Sepolia)
 * @returns The contract address or undefined if not found
 */
export function getContractAddressByChainId(
  chainId: number | undefined
): `0x${string}` | undefined {
  if (!chainId) {
    return undefined;
  }

  const entry = FHERaffleAddresses[chainId.toString() as keyof typeof FHERaffleAddresses];
  if (!entry || entry.address === "0x0000000000000000000000000000000000000000") {
    return undefined;
  }

  return entry.address as `0x${string}`;
}

