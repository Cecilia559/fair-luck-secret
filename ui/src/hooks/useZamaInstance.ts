import { useState, useEffect } from 'react';

async function loadFHE() {
  try {
    // Try bundle import first
    const bundle = await import('@zama-fhe/relayer-sdk/bundle');
    
    // Check if exports are available
    if (!bundle.initSDK || !bundle.createInstance || !bundle.SepoliaConfig) {
      throw new Error('FHE SDK bundle exports are incomplete');
    }
    
    return {
      createInstance: bundle.createInstance,
      initSDK: bundle.initSDK,
      SepoliaConfig: bundle.SepoliaConfig
    };
  } catch (e) {
    console.error('Bundle import failed:', e);
    // Fallback: try to use global SDK if available (from CDN)
    if (typeof window !== 'undefined' && (window as any).relayerSDK) {
      console.log('Using global relayerSDK from window');
      const globalSDK = (window as any).relayerSDK;
      return {
        createInstance: globalSDK.createInstance,
        initSDK: globalSDK.initSDK,
        SepoliaConfig: globalSDK.SepoliaConfig
      };
    }
    throw new Error('FHE SDK not available - bundle import failed and no global SDK found');
  }
}

export function useZamaInstance() {
  const [instance, setInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initZama = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading FHE SDK...');
        const sdk = await loadFHE();
        
        if (!sdk.initSDK || !sdk.createInstance || !sdk.SepoliaConfig) {
          throw new Error('FHE SDK is not properly loaded. Missing required functions.');
        }

        console.log('Initializing FHE SDK...');
        await sdk.initSDK();
        console.log('FHE SDK initialized successfully');

        // Use SepoliaConfig for testnet
        // For local development, we'll use SepoliaConfig
        console.log('Creating FHE instance...');
        const zamaInstance = await sdk.createInstance(sdk.SepoliaConfig);
        console.log('FHE instance created successfully');

        if (mounted) {
          setInstance(zamaInstance);
        }
      } catch (err: any) {
        console.error('Failed to initialize Zama instance:', err);
        console.error('Error details:', {
          name: err?.name,
          message: err?.message,
          stack: err?.stack
        });
        if (mounted) {
          setError(err?.message || 'Failed to initialize encryption service. Please refresh the page.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initZama();

    return () => {
      mounted = false;
    };
  }, []);

  return { instance, isLoading, error };
}

