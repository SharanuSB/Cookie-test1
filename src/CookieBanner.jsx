import { useEffect, useState } from 'react';

/**
 * Cookie Banner Component
 * Uses the CDN-hosted cookie banner files with improved error handling
 * and debugging for API connection issues
 * 
 * @returns {null} This component doesn't render anything directly
 */
const CookieBanner = ({ 
  clientId = '6808cc3313e4ca9604cf7ad0', 
  apiEndpoint = 'http://localhost:4400/bluetic-svc/api/v1/cookie',
  cdnRoot = 'https://cdn.jsdelivr.net/gh/SharanuSb/cookie-cdn@v1.1.3/dist'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [cookieBanner, setCookieBanner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[CookieBanner] Initializing with config:', {
      clientId,
      apiEndpoint,
      cdnRoot
    });

    // Test API endpoint directly before proceeding
    testApiEndpoint(apiEndpoint, clientId)
      .then(result => {
        console.log('[CookieBanner] API test result:', result);
        initializeBanner();
      })
      .catch(error => {
        console.error('[CookieBanner] API test failed:', error);
        // Still proceed with initialization, the banner will use defaults
        initializeBanner();
      });

    function initializeBanner() {
      // Set the iframe host configuration
      window.CookieBannerConfig = {
        host: `/cookie-banner.html`
      };

      // Create and append the script tag
      const script = document.createElement('script');
      script.src = `/cookie-banner-embed.js`;
      script.async = true;
      
      // Add detailed error handling for script loading
      script.onerror = (error) => {
        console.error('[CookieBanner] Failed to load script:', error);
        setError('Failed to load cookie banner script');
      };

      document.body.appendChild(script);

      // Initialize the cookie banner after script loads
      script.onload = () => {
        console.log('[CookieBanner] Script loaded successfully');
        
        try {
          if (!window.CookieBannerEmbed) {
            throw new Error('CookieBannerEmbed not found on window object');
          }

          const banner = new window.CookieBannerEmbed(clientId, {
            apiEndpoint: apiEndpoint,
            domain: window.location.hostname,
            cdnRoot: cdnRoot,
            onAcceptAll: (preferences) => {
              console.log('[CookieBanner] All cookies accepted:', preferences);
            },
            onRejectAll: (preferences) => {
              console.log('[CookieBanner] All cookies rejected:', preferences);
            },
            onSavePreferences: (preferences) => {
              console.log('[CookieBanner] Preferences saved:', preferences);
            },
            onBannerShown: () => {
              console.log('[CookieBanner] Banner shown');
            },
            onBannerClosed: () => {
              console.log('[CookieBanner] Banner closed');
            },
            onModalShown: () => {
              console.log('[CookieBanner] Modal shown');
            },
            onModalClosed: () => {
              console.log('[CookieBanner] Modal closed');
            },
            onPreferencesChanged: (preferences) => {
              console.log('[CookieBanner] Preferences changed:', preferences);
              
              // Example: disable Google Analytics if analytics cookies are rejected
              if (!preferences.analytics) {
                window['ga-disable-UA-XXXXX-Y'] = true;
              }
            },
            onInitialized: (data) => {
              console.log('[CookieBanner] Initialized:', data);
              setIsInitialized(true);
              
              // Log API status
              if (data.apiSuccessful === false) {
                console.warn('[CookieBanner] Using default configuration due to API issues');
              }
            },
            onError: (error) => {
              console.error('[CookieBanner] Error:', error);
              setError(error.message || 'Unknown cookie banner error');
            }
          });

          setCookieBanner(banner);

          // Initialize the banner with timeout
          const initTimeout = setTimeout(() => {
            console.error('[CookieBanner] Initialization timed out');
            setError('Cookie banner initialization timed out');
          }, 10000);

          banner.init()
            .then(() => {
              clearTimeout(initTimeout);
              console.log('[CookieBanner] Initialized successfully');
              
              // Manually test API connection for debugging
              if (typeof banner.testApiConnection === 'function') {
                console.log('[CookieBanner] Testing API connection');
                banner.testApiConnection();
              }
              
              banner.show();
            })
            .catch(error => {
              clearTimeout(initTimeout);
              console.error('[CookieBanner] Initialization failed:', error);
              setError(error.message || 'Failed to initialize cookie banner');
            });
        } catch (error) {
          console.error('[CookieBanner] Setup error:', error);
          setError(error.message || 'Error setting up cookie banner');
        }
      };
    }

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="cookie-banner-embed.js"]');
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientId, apiEndpoint, cdnRoot]);

  // Public API for parent components to interact with cookie banner
  const resetCookiePreferences = () => {
    if (cookieBanner && isInitialized) {
      cookieBanner.resetPreferences();
    } else {
      console.warn('[CookieBanner] Cannot reset preferences - not initialized');
    }
  };

  const checkCookieType = (type) => {
    if (cookieBanner && isInitialized) {
      return cookieBanner.isAllowed(type);
    }
    return false;
  };

  // Expose methods to parent component via window object
  useEffect(() => {
    if (window) {
      window.cookieBannerAPI = {
        reset: resetCookiePreferences,
        isAllowed: checkCookieType,
        debug: () => {
          if (cookieBanner && typeof cookieBanner._debug === 'function') {
            return cookieBanner._debug();
          }
          return { initialized: isInitialized, error };
        }
      };
    }
  }, [isInitialized, cookieBanner, error]);

  /**
   * Helper function to test API endpoint directly
   */
  async function testApiEndpoint(apiUrl, clientId) {
    console.log(`[CookieBanner] Testing API endpoint: ${apiUrl}/${clientId}/client`);
    
    try {
      const response = await fetch(`${apiUrl}/${clientId}/client`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      console.log(`[CookieBanner] API response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const text = await response.text();
      
      try {
        // Try to parse as JSON
        const data = JSON.parse(text);
        return {
          success: true,
          data: data
        };
      } catch (e) {
        return {
          success: false,
          error: 'Invalid JSON response',
          text: text
        };
      }
    } catch (error) {
      console.error('[CookieBanner] Direct API test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // This component doesn't render anything visible by default
  // But we can optionally show error state for debugging
  return error ? (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: '#fff1f0',
        border: '1px solid #ffa39e',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#cf1322',
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      <strong>Cookie Banner Error:</strong> {error}
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#888' }}>
        <strong>Debug Info:</strong> ClientID: {clientId}, API: {apiEndpoint}
      </div>
    </div>
  ) : null;
};

export default CookieBanner;