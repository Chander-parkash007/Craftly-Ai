# 🚀 Vercel Deployment Guide for Craftly AI

## Current Issue: API Not Working on Vercel

If your app is deployed on Vercel but the AI features aren't working, follow this guide.

## 🔍 Common Vercel Issues

### Issue 1: Environment Variable Not Set Correctly

**Symptoms:**
- App works locally but not on Vercel
- Console shows "Groq key loaded: NO - KEY MISSING"
- Getting fallback materials/crafts

**Solution:**

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Look for `REACT_APP_GROQ_API_KEY`

3. **Verify the Variable Name**
   - Must be exactly: `REACT_APP_GROQ_API_KEY` (case-sensitive)
   - NOT: `GROQ_API_KEY` or `REACT_GROQ_API_KEY`

4. **Check the Value**
   - Should start with `gsk_`
   - Should be 50+ characters long
   - No extra spaces before/after

5. **Set for All Environments**
   - Check boxes for: **Production**, **Preview**, **Development**

6. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots on latest deployment
   - Click **Redeploy**
   - Wait for build to complete

### Issue 2: Build-Time vs Runtime Variables

**Problem:** React apps need environment variables at BUILD time, not runtime.

**Solution:**

1. **Ensure Variable Exists Before Build**
   - Variables must be set in Vercel BEFORE deploying
   - If you add them after, you MUST redeploy

2. **Trigger New Build**
   ```bash
   # Option 1: From Vercel Dashboard
   Deployments → Redeploy (with "Use existing Build Cache" UNCHECKED)
   
   # Option 2: Push to Git
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

### Issue 3: Wrong Variable Prefix

**Problem:** Vercel might not expose variables without `REACT_APP_` prefix.

**Check:**
- Variable name: `REACT_APP_GROQ_API_KEY` ✅
- NOT: `GROQ_API_KEY` ❌
- NOT: `NEXT_PUBLIC_GROQ_API_KEY` ❌

### Issue 4: CORS or API Errors

**Symptoms:**
- Console shows API errors
- Network tab shows failed requests
- "CORS policy" errors

**Solution:**
- Groq API should work from browser (no CORS issues)
- Check if API key is valid at https://console.groq.com
- Verify you haven't exceeded rate limits

## ✅ Step-by-Step Fix for Vercel

### Step 1: Verify Local Setup Works

```bash
# Test locally first
npm start

# Check browser console
# Should see: "Groq key loaded: YES"
```

### Step 2: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your Craftly AI project

2. **Navigate to Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in sidebar

3. **Add/Update Variable**
   - **Key**: `REACT_APP_GROQ_API_KEY`
   - **Value**: Your Groq API key (starts with `gsk_`)
   - **Environments**: Check ALL three boxes
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Save**
   - Click **Save**
   - Confirm the variable appears in the list

### Step 3: Force Rebuild

**Important:** Adding/changing environment variables requires a rebuild!

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯) menu
4. Click **Redeploy**
5. **UNCHECK** "Use existing Build Cache"
6. Click **Redeploy**

**Option B: Push to Git**
```bash
git commit --allow-empty -m "Rebuild with env vars"
git push
```

### Step 4: Verify Deployment

1. **Wait for Build to Complete**
   - Watch the build logs
   - Should complete without errors

2. **Visit Your Site**
   - Open your Vercel URL
   - Press **F12** to open console

3. **Check Console Logs**
   - Look for: `=== Craftly AI - API Configuration ===`
   - Should show: `Groq key loaded: YES`
   - Should show: `API key is valid: true`

4. **Test Features**
   - Upload an image
   - Click "Detect Materials"
   - Should see AI-detected materials (not fallback)

## 🐛 Debugging on Vercel

### Check Build Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Building** to see logs
4. Look for environment variable warnings

### Check Runtime Logs

1. Go to your deployment
2. Click **View Function Logs** (if using serverless)
3. Or check browser console on the live site

### Verify Environment Variables

Add this temporarily to `src/App.jsx` to debug:

```javascript
// Add at the top of the component
useEffect(() => {
  console.log('All env vars:', Object.keys(process.env).filter(k => k.startsWith('REACT_APP_')));
  console.log('GROQ key exists:', !!process.env.REACT_APP_GROQ_API_KEY);
}, []);
```

## 📋 Vercel Environment Variable Checklist

- [ ] Variable name is exactly `REACT_APP_GROQ_API_KEY`
- [ ] Value starts with `gsk_`
- [ ] Value is 50+ characters long
- [ ] No extra spaces in the value
- [ ] All three environments are checked (Production, Preview, Development)
- [ ] Redeployed AFTER adding/changing the variable
- [ ] Build completed successfully
- [ ] Console shows "Groq key loaded: YES"
- [ ] Console shows "API key is valid: true"

## 🔒 Security Best Practices

### ⚠️ Important: Client-Side Exposure

**Note:** Since this is a React app, the API key is exposed in the browser. This is generally okay for Groq's free tier, but be aware:

- ✅ Groq has rate limiting per key
- ✅ Free tier is sufficient for personal use
- ⚠️ Anyone can see your key in browser DevTools
- ⚠️ Consider backend proxy for production apps

### Better Approach (Optional)

For production, consider:

1. **Create a Backend API**
   - Use Vercel Serverless Functions
   - Keep API key server-side
   - Proxy requests through your backend

2. **Example Structure**
   ```
   /api/detect-materials.js  (Vercel Function)
   /api/generate-crafts.js   (Vercel Function)
   ```

3. **Benefits**
   - API key stays secret
   - Better rate limit control
   - Can add authentication

## 🚀 Quick Commands

### Redeploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Redeploy
vercel --prod
```

### Check Environment Variables

```bash
# List all env vars
vercel env ls

# Pull env vars locally
vercel env pull
```

## 📞 Still Not Working?

### 1. Check Vercel Status
- Visit https://www.vercel-status.com
- Ensure no ongoing incidents

### 2. Check Groq API Status
- Visit https://status.groq.com
- Verify API is operational

### 3. Test API Key Directly

```bash
# Test your API key with curl
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 4. Common Mistakes

❌ **Wrong:** `GROQ_API_KEY=gsk_123...`  
✅ **Right:** `REACT_APP_GROQ_API_KEY=gsk_123...`

❌ **Wrong:** Adding env var but not redeploying  
✅ **Right:** Add env var → Redeploy

❌ **Wrong:** Checking only "Production"  
✅ **Right:** Check all three environments

## 📊 Expected Behavior

### With Valid API Key:
```
Console Output:
=== Craftly AI - API Configuration ===
Environment: production
Groq key loaded: YES (gsk_abcd...)
Key length: 56
Key starts with gsk_: true
API key is valid: true
=====================================
```

### Without Valid API Key:
```
Console Output:
=== Craftly AI - API Configuration ===
Environment: production
Groq key loaded: NO - KEY MISSING
Key length: 0
Key starts with gsk_: false
API key is valid: false
=====================================
```

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Build completes without errors
2. ✅ Console shows "API key is valid: true"
3. ✅ Material detection shows unique items from your image
4. ✅ Craft generation shows creative, varied ideas
5. ✅ No "API key not configured" errors

---

**Need more help?** Check the Vercel documentation: https://vercel.com/docs/environment-variables
