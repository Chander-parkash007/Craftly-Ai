import React from 'react';

/**
 * Diagnostic Page for Craftly AI
 * 
 * This component helps debug environment variable and API issues,
 * especially useful for Vercel deployments.
 * 
 * To use: Import and add to your App.jsx routing
 */
export default function DiagnosticPage() {
  const groqKey = process.env.REACT_APP_GROQ_API_KEY;
  const isValidKey = groqKey && 
                     groqKey !== 'paste_your_groq_key_here' && 
                     groqKey.length > 20 && 
                     groqKey.startsWith('gsk_');

  const allEnvVars = Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'));

  const testAPI = async () => {
    if (!isValidKey) {
      alert('Cannot test API: Invalid or missing API key');
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Say "API is working!" in JSON format: {"status":"working"}' }],
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ API Test Successful!\n\n' + JSON.stringify(data, null, 2));
      } else {
        const error = await response.json();
        alert('❌ API Test Failed!\n\n' + JSON.stringify(error, null, 2));
      }
    } catch (err) {
      alert('❌ API Test Error!\n\n' + err.message);
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'monospace',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>🔍 Craftly AI Diagnostics</h1>

      {/* Environment Info */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#3CCFCF', marginBottom: '15px' }}>Environment Information</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Node Environment:</td>
              <td style={{ padding: '10px' }}>{process.env.NODE_ENV || 'not set'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Build Time:</td>
              <td style={{ padding: '10px' }}>{new Date().toISOString()}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>User Agent:</td>
              <td style={{ padding: '10px', fontSize: '12px' }}>{navigator.userAgent}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* API Key Status */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#3CCFCF', marginBottom: '15px' }}>API Key Status</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Key Exists:</td>
              <td style={{ padding: '10px' }}>
                <span style={{ color: groqKey ? 'green' : 'red', fontWeight: 'bold' }}>
                  {groqKey ? '✅ YES' : '❌ NO'}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Key Length:</td>
              <td style={{ padding: '10px' }}>{groqKey ? groqKey.length : 0} characters</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Starts with 'gsk_':</td>
              <td style={{ padding: '10px' }}>
                <span style={{ color: groqKey?.startsWith('gsk_') ? 'green' : 'red', fontWeight: 'bold' }}>
                  {groqKey?.startsWith('gsk_') ? '✅ YES' : '❌ NO'}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Key Preview:</td>
              <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
                {groqKey ? `${groqKey.substring(0, 12)}...${groqKey.substring(groqKey.length - 4)}` : 'N/A'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Is Valid:</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  color: isValidKey ? 'green' : 'red', 
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {isValidKey ? '✅ VALID' : '❌ INVALID'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Environment Variables */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#3CCFCF', marginBottom: '15px' }}>Environment Variables</h2>
        <p style={{ marginBottom: '10px' }}>
          Found {allEnvVars.length} REACT_APP_* variable(s):
        </p>
        {allEnvVars.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {allEnvVars.map(key => (
              <li key={key} style={{ 
                padding: '8px', 
                background: '#f9f9f9', 
                marginBottom: '5px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                {key}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            ⚠️ No REACT_APP_* environment variables found!
          </p>
        )}
      </div>

      {/* API Test */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#3CCFCF', marginBottom: '15px' }}>API Connection Test</h2>
        <button
          onClick={testAPI}
          disabled={!isValidKey}
          style={{
            padding: '12px 24px',
            background: isValidKey ? '#3CCFCF' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isValidKey ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
        >
          {isValidKey ? '🧪 Test Groq API Connection' : '❌ Cannot Test (Invalid Key)'}
        </button>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          This will make a test API call to verify your key works.
        </p>
      </div>

      {/* Recommendations */}
      <div style={{ background: isValidKey ? '#e8f8f8' : '#fff4f4', padding: '20px', borderRadius: '8px', border: `2px solid ${isValidKey ? '#3CCFCF' : '#FF6F61'}` }}>
        <h2 style={{ color: isValidKey ? '#3CCFCF' : '#FF6F61', marginBottom: '15px' }}>
          {isValidKey ? '✅ Status: Ready' : '⚠️ Action Required'}
        </h2>
        {isValidKey ? (
          <div>
            <p style={{ marginBottom: '10px' }}>Your API key is configured correctly!</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Material detection should work</li>
              <li>Craft generation should work</li>
              <li>Click "Test API Connection" to verify</li>
            </ul>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Your API key is not configured properly.</p>
            <p style={{ marginBottom: '10px' }}>To fix this on Vercel:</p>
            <ol style={{ paddingLeft: '20px' }}>
              <li>Go to Vercel Dashboard → Your Project → Settings</li>
              <li>Click "Environment Variables"</li>
              <li>Add variable: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>REACT_APP_GROQ_API_KEY</code></li>
              <li>Set value to your Groq API key (starts with gsk_)</li>
              <li>Check all environments (Production, Preview, Development)</li>
              <li>Save and redeploy your app</li>
            </ol>
            <p style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
              Get a free API key: <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3CCFCF' }}>https://console.groq.com</a>
            </p>
          </div>
        )}
      </div>

      {/* Back Link */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ 
          color: '#3CCFCF', 
          textDecoration: 'none', 
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          ← Back to Craftly AI
        </a>
      </div>
    </div>
  );
}
