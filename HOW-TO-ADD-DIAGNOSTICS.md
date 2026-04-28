# 🔧 How to Add Diagnostic Page

A diagnostic page has been created to help you debug API issues on Vercel.

## Quick Setup (2 minutes)

### Option 1: Temporary Route (Easiest)

Add this to your `src/App.jsx`:

```javascript
// At the top, add import
import DiagnosticPage from './DiagnosticPage';

// Inside the main component, add this check at the very beginning
export default function CraftlyAI() {
  // Add this diagnostic check
  if (window.location.pathname === '/diagnostics') {
    return <DiagnosticPage />;
  }

  // ... rest of your component code
```

Then visit: `https://your-app.vercel.app/diagnostics`

### Option 2: Conditional Render (Better)

Add this at the top of your `src/App.jsx`:

```javascript
import DiagnosticPage from './DiagnosticPage';

export default function CraftlyAI() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Add keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDiagnostics(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (showDiagnostics) {
    return <DiagnosticPage />;
  }

  // ... rest of your component
```

Then press: `Ctrl + Shift + D` to toggle diagnostics

## What the Diagnostic Page Shows

1. **Environment Information**
   - Node environment (production/development)
   - Build time
   - User agent

2. **API Key Status**
   - Whether key exists
   - Key length
   - If it starts with 'gsk_'
   - Key preview (first/last characters)
   - Validation status

3. **Environment Variables**
   - Lists all REACT_APP_* variables
   - Helps verify Vercel configuration

4. **API Connection Test**
   - Button to test actual API call
   - Shows if Groq API is reachable
   - Displays response or error

5. **Recommendations**
   - Shows what's wrong
   - Provides step-by-step fixes
   - Links to get API key

## Using the Diagnostic Page

### On Vercel:

1. Deploy your app with the diagnostic page
2. Visit `https://your-app.vercel.app/diagnostics`
3. Check the API Key Status section
4. If invalid, follow the recommendations
5. Click "Test API Connection" to verify

### Expected Results:

**If Working:**
```
✅ Key Exists: YES
✅ Starts with 'gsk_': YES
✅ Is Valid: VALID
✅ Test API Connection: Success
```

**If Not Working:**
```
❌ Key Exists: NO (or YES but invalid)
❌ Starts with 'gsk_': NO
❌ Is Valid: INVALID
❌ Test API Connection: Disabled
```

## Troubleshooting with Diagnostics

### Issue: "Key Exists: NO"

**Fix:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add `REACT_APP_GROQ_API_KEY`
4. Redeploy

### Issue: "Key Exists: YES" but "Is Valid: INVALID"

**Possible causes:**
- Key doesn't start with 'gsk_'
- Key is too short (< 20 chars)
- Key is still the placeholder

**Fix:**
1. Check the key in Vercel settings
2. Get a new key from console.groq.com
3. Update in Vercel
4. Redeploy

### Issue: "Test API Connection" fails

**Possible causes:**
- Invalid API key
- Rate limit exceeded
- Network issues
- Groq API is down

**Fix:**
1. Verify key at console.groq.com
2. Check Groq status: status.groq.com
3. Wait a few minutes and retry
4. Generate a new API key

## Removing Diagnostics (After Fixing)

Once everything works, you can:

1. **Keep it** (recommended for future debugging)
   - Only accessible via direct URL or keyboard shortcut
   - Doesn't affect normal users

2. **Remove it**
   - Delete `src/DiagnosticPage.jsx`
   - Remove the import and conditional from `App.jsx`

## Security Note

The diagnostic page shows:
- ✅ First 12 and last 4 characters of API key
- ❌ NOT the full API key

This is safe for debugging but still be cautious about sharing screenshots.

---

**This diagnostic page will help you quickly identify and fix API configuration issues on Vercel!**
