const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  authToken: 'token',
  pollingInterval: 2000,    // 2 seconds
  pollingTimeout: 300000,   // 5 minutes
}

export default config
