// Use an external, reliable URL, or a tiny, uncached resource on your server
const PING_URL = 'https://www.google.com/favicon.ico'; 

export async function checkInternetConnection(): Promise<boolean> {
  try {
    // 1. Use the Fetch API to make a request.
    // 2. Add a unique query param (Date.now()) to prevent caching.
    // 3. Set a timeout to quickly fail if the request hangs.
    const response = await fetch(`${PING_URL}?t=${Date.now()}`, {
      method: 'HEAD', // HEAD is fast, it only requests headers
      mode: 'no-cors',
      cache: 'no-store', // Essential to get a fresh response
      signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
    });

    // If fetch succeeds, we have network access (status 200-299 is typical for HEAD, 
    // but with 'no-cors', we just check if the promise resolved).
    // If the promise resolves, we assume the initial network route is open.
    return true; 
    
  } catch (error: any) {
    // A network error (like DNS failure, complete disconnection, or timeout) 
    // will cause the fetch promise to reject.
    console.error("Ping failed:", error);
    return false;
  }
}