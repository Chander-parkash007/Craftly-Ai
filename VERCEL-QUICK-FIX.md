# 🚀 Vercel Quick Fix - Craftly AI

## Your Situation

✅ App is deployed on Vercel  
✅ API key is in environment variables  
❌ AI features not working  

## Most Likely Issues

### 1. Environment Variable Name Wrong

**Check:** Is it exactly `REACT_APP_GROQ_API_KEY`?

❌ Wrong names:
- `GROQ_API_KEY`
- `REACT_GROQ_API_KEY`
- `NEXT_PUBLIC_GROQ_API_KEY`

✅ Correct: `REACT_APP_GROQ_API_KEY`

**Fix:**
1. Vercel Dashboard → Your Project → Settings
2. Environment Variables
3. Delete wrong variable
4. Add new: `REACT_APP_GROQ_API_KEY`
5. Redeploy

---

### 2. Didn't Redeploy After Adding Variable

**Problem:** React apps need env vars at BUILD time, not runtime.

**Fix:**
1. Vercel Dashboard → Deployments
2. Click ⋯ on latest deployment
3. Click "Redeploy"
4. **UNCHECK** "Use existing Build Cache"
5. Click "Redeploy"

---

### 3. Not Set for All Environments

**Check:** Are all three boxes checked?

Required:
- ✅ Production
- ✅ Preview
- ✅ Development

**Fix:**
1. Settings → Environment Variables
2. Click on your variable
3. Check all three boxes
4. Save
5. Redeploy

---

### 4. Invalid API Key Format

**Check:** Does your key start with `gsk_`?

❌ Invalid:
- `paste_your_groq_key_here`
- Keys starting with `sk-`
- Keys less than 40 characters

✅ Valid:
- Starts with `gsk_`
- 50+ characters long
- From console.groq.com

**Fix:**
1. Go to https://console.groq.com
2. Generate new API key
3. Copy the full key
4. Update in Vercel
5. Redeploy

---

## Step-by-Step Fix (5 Minutes)

### Step 1: Verify Vercel Settings

```
1. Go to: https://vercel.com/dashboard
2. Select your Craftly AI project
3. Click "Settings" tab
4. Click "Environment Variables"
5. Find: REACT_APP_GROQ_API_KEY
```

**What to check:**
- [ ] Variable name is exactly `REACT_APP_GROQ_API_KEY`
- [ ] Value starts with `gsk_`
- [ ] Value is 50+ characters
- [ ] All three environments checked
- [ ] No extra spaces in value

### Step 2: Update if Needed

If anything is wrong:

```
1. Click "Edit" on the variable
2. Fix the name/value
3. Check all three environment boxes
4. Click "Save"
```

### Step 3: Force Rebuild

**Critical:** You MUST rebuild after changing env vars!

```
1. Go to "Deployments" tab
2. Find latest deployment
3. Click the three dots (⋯)
4. Click "Redeploy"
5. UNCHECK "Use existing Build Cache"
6. Click "Redeploy"
7. Wait for build to complete (2-3 minutes)
```

### Step 4: Verify It Works

```
1. Visit your Vercel URL
2. Press F12 (open console)
3. Look for: "=== Craftly AI - API Configuration ==="
4. Should show: "Groq key loaded: YES"
5. Should show: "API key is valid: true"
```

**Test the features:**
- Upload an image
- Click "Detect Materials"
- Should see AI-detected materials (not generic fallback)

---

## Quick Diagnostic Commands

### Check from Browser Console

Visit your Vercel site and run in console:

```javascript
// Check if env var exists
console.log('Has key:', !!process.env.REACT_APP_GROQ_API_KEY);

// Check key format (safe - only shows first 8 chars)
const key = process.env.REACT_APP_GROQ_API_KEY;
console.log('Key preview:', key ? key.substring(0, 8) + '...' : 'MISSING');
console.log('Starts with gsk_:', key?.startsWith('gsk_'));
```

### Expected Output (Working):

```
Has key: true
Key preview: gsk_abcd...
Starts with gsk_: true
```

### Expected Output (Not Working):

```
Has key: false
Key preview: MISSING
Starts with gsk_: false
```

---

## Common Mistakes

### ❌ Mistake 1: Wrong Variable Name

```
GROQ_API_KEY=gsk_123...  ← Won't work!
```

```
REACT_APP_GROQ_API_KEY=gsk_123...  ← Correct!
```

### ❌ Mistake 2: Added Var But Didn't Redeploy

Adding/changing env vars requires a **full rebuild**!

### ❌ Mistake 3: Only Checked "Production"

Must check ALL THREE:
- Production
- Preview  
- Development

### ❌ Mistake 4: Used Build Cache

When redeploying, **UNCHECK** "Use existing Build Cache"

---

## Still Not Working?

### Option 1: Use Diagnostic Page

1. Add the diagnostic page (see `HOW-TO-ADD-DIAGNOSTICS.md`)
2. Visit `/diagnostics` on your Vercel URL
3. See exactly what's wrong
4. Follow the recommendations

### Option 2: Check Build Logs

1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check build logs for errors
4. Look for environment variable warnings

### Option 3: Test API Key Directly

```bash
# Test your key with curl
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role":"user","content":"test"}],
    "max_tokens": 10
  }'
```

If this fails, your API key is invalid.

---

## Checklist

Before asking for help, verify:

- [ ] Variable name is `REACT_APP_GROQ_API_KEY` (exact)
- [ ] Value starts with `gsk_`
- [ ] Value is 50+ characters
- [ ] All three environments checked
- [ ] Saved the variable
- [ ] Redeployed AFTER saving
- [ ] Unchecked "Use existing Build Cache"
- [ ] Build completed successfully
- [ ] Waited for deployment to finish
- [ ] Cleared browser cache
- [ ] Checked browser console for errors

---

## Success Indicators

You'll know it's working when:

1. ✅ Build completes without errors
2. ✅ Console shows: `Groq key loaded: YES`
3. ✅ Console shows: `API key is valid: true`
4. ✅ Material detection shows unique items
5. ✅ Craft generation shows creative ideas
6. ✅ No fallback materials/crafts

---

## Need More Help?

1. **Detailed Guide**: Read `VERCEL-DEPLOYMENT-GUIDE.md`
2. **Add Diagnostics**: Read `HOW-TO-ADD-DIAGNOSTICS.md`
3. **Vercel Docs**: https://vercel.com/docs/environment-variables
4. **Groq Console**: https://console.groq.com

---

**Most issues are fixed by ensuring the variable name is correct and redeploying!**
