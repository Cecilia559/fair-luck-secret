import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';

// Mock chains configuration for local development
const MOCK_CHAINS: Record<number, string> = {
  31337: 'http://localhost:8545', // Hardhat local network
};

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { chainId } = useAccount();

  useEffect(() => {
    let mounted = true;

    const initZama = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for CDN script to load if needed
        if (typeof window !== 'undefined' && !(window as any).relayerSDK) {
          console.warn('FHE SDK CDN script not loaded, waiting...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!(window as any).relayerSDK) {
            throw new Error('FHE SDK CDN script not loaded. Please check network connection and ensure the CDN script is included in index.html');
          }
        }

        console.log('Initializing FHE SDK...');
        await initSDK();
        console.log('FHE SDK initialized successfully');

        // Use window.ethereum as network provider to automatically use the connected network
        // For local development (chainId 31337), FHE operations may not work, but we'll still initialize
        // For Sepolia (chainId 11155111), use SepoliaConfig
        const isLocalNetwork = chainId === 31337;
        
        if (isLocalNetwork) {
          console.warn('Local network detected. FHE operations may not work on local networks.');
          console.warn('Please switch to Sepolia network for full FHE functionality.');
          // For local development, we'll still try to create an instance but it may fail
          // This allows the UI to work even if FHE isn't fully functional
        }

        console.log('Creating FHE instance...');
        
        // Check if this is a mock chain (local development)
        const isMockChain = chainId && MOCK_CHAINS[chainId];
        
        if (isMockChain) {
          console.log('Local network detected, using mock FHE instance');
          // For local networks, we'll still try to create an instance
          // but it may not work fully without FHE support
          // The contract operations should still work for non-FHE functions
          const config = {
            ...SepoliaConfig,
            network: typeof window !== 'undefined' && (window as any).ethereum 
              ? (window as any).ethereum 
              : MOCK_CHAINS[chainId]
          };
          
          try {
            const zamaInstance = await createInstance(config);
            console.log('FHE instance created successfully (mock mode)');
            if (mounted) {
              setInstance(zamaInstance);
            }
          } catch (mockError: any) {
            console.warn('FHE instance creation failed in mock mode:', mockError);
            // For local networks, we can continue without FHE instance
            // as long as we're not using FHE operations
            if (mounted) {
              setInstance(null);
              setError(null); // Don't show error for local network
            }
          }
        } else {
          // For Sepolia or other networks, use standard config
          const config = {
            ...SepoliaConfig,
            network: typeof window !== 'undefined' && (window as any).ethereum 
              ? (window as any).ethereum 
              : SepoliaConfig.network
          };
          
          const zamaInstance = await createInstance(config);
          console.log('FHE instance created successfully');
          
          if (mounted) {
            setInstance(zamaInstance);
          }
        }
      } catch (err: any) {
        console.error('Failed to initialize Zama instance:', err);
        console.error('Error details:', {
          name: err?.name,
          message: err?.message,
          stack: err?.stack
        });
        
        // For local networks, this is expected - don't show error
        if (chainId === 31337) {
          console.warn('FHE SDK initialization failed on local network. This is expected.');
          console.warn('Please switch to Sepolia network for full FHE functionality.');
          if (mounted) {
            setError(null); // Don't show error for local network
            setIsLoading(false);
          }
        } else {
          if (mounted) {
            setError(err?.message || 'Failed to initialize encryption service. Please refresh the page.');
          }
        }
      } finally {
        if (mounted && chainId !== 31337) {
          setIsLoading(false);
        }
      }
    };

    initZama();

    return () => {
      mounted = false;
    };
  }, [chainId]);

  return { instance, isLoading, error };
}

