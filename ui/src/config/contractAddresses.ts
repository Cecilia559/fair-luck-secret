// Contract addresses by chain ID
// This file should be updated after deployment to each network
export const FHERaffleAddresses: Record<string, { address: `0x${string}`; chainId: number; chainName: string }> = {
  "31337": {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    chainId: 31337,
    chainName: "hardhat",
  },
  "11155111": {
    address: "0x0000000000000000000000000000000000000000", // Update after Sepolia deployment
    chainId: 11155111,
    chainName: "sepolia",
  },
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

  const entry = FHERaffleAddresses[chainId.toString()];
  if (!entry || entry.address === "0x0000000000000000000000000000000000000000") {
    return undefined;
  }

  return entry.address;
}

