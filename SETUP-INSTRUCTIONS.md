# 🚀 Craftly AI - Complete Setup Instructions

## ⚠️ IMPORTANT: API Key Required

Your app is currently using a **placeholder API key**. To enable AI features (material detection and craft generation), you need to configure a real Groq API key.

## 📋 Step-by-Step Setup

### Step 1: Get Your Free Groq API Key

1. **Visit Groq Console**: https://console.groq.com
2. **Sign Up**: Create a free account (no credit card required)
3. **Navigate to API Keys**: Click on "API Keys" in the sidebar
4. **Create New Key**: Click "Create API Key"
5. **Copy the Key**: Copy the entire key (starts with `gsk_`)

### Step 2: Configure the API Key

1. **Open the `.env` file** in your project root folder
2. **Replace the placeholder**:
   
   Change this:
   ```
   REACT_APP_GROQ_API_KEY=paste_your_groq_key_here
   ```
   
   To this (with your actual key):
   ```
   REACT_APP_GROQ_API_KEY=gsk_your_actual_key_here_1234567890
   ```

3. **Save the file**

### Step 3: Restart the Application

1. **Stop the app** if it's running (press `Ctrl + C` in the terminal)
2. **Start it again**:
   ```bash
   npm start
   ```
3. **Wait for the browser** to open at http://localhost:3000

## ✅ Verify It's Working

### Check Console Logs

1. Open browser **Developer Tools** (press `F12`)
2. Go to the **Console** tab
3. Look for: `Groq key loaded: YES (gsk_xxxx...)`
4. If you see `NO - KEY MISSING`, the API key is not configured correctly

### Test Material Detection

1. Click **"Start Creating"**
2. Upload an image of household items
3. Click **"Detect Materials"**
4. If working correctly, you'll see AI-detected materials
5. If not working, you'll see fallback materials (cardboard, plastic bottle, paper, fabric)

### Test Craft Generation

1. After reviewing materials, set your preferences
2. Click **"Generate Ideas"**
3. If working correctly, you'll see unique, creative craft ideas
4. If not working, you'll see generic fallback crafts

## 🔧 Troubleshooting

### Issue: "API key not configured" error

**Solution:**
- Make sure you saved the `.env` file after editing
- Verify the key starts with `gsk_`
- Restart the app completely
- Clear browser cache and reload

### Issue: API errors in console

**Possible causes:**
1. **Invalid API key**: Get a new key from Groq console
2. **Rate limit exceeded**: Wait a few minutes and try again
3. **Network issues**: Check your internet connection

### Issue: Still seeing fallback materials/crafts

**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Verify API key is loaded: should see "Groq key loaded: YES"
4. Try uploading a different image
5. Check that the `.env` file is in the project root (same folder as `package.json`)

### Issue: Changes to .env not taking effect

**Solution:**
1. Stop the development server (`Ctrl + C`)
2. Delete the `.env` file
3. Create a new `.env` file with your API key
4. Restart: `npm start`

## 📊 API Usage Limits

Groq free tier includes:
- **14,400 requests per day**
- **30 requests per minute**
- More than enough for personal use and testing

## 🎯 What Works Without API Key?

Even without a valid API key, the app will:
- ✅ Load and display the interface
- ✅ Allow image uploads
- ✅ Show fallback materials
- ✅ Generate basic fallback craft ideas
- ✅ Save favorites
- ✅ Display all UI features

But you'll miss:
- ❌ AI-powered material detection from images
- ❌ Creative, personalized craft suggestions
- ❌ Variety in craft ideas

## 🔐 Security Notes

- **Never commit** your API key to Git
- The `.env` file is already in `.gitignore`
- **Don't share** your API key publicly
- If exposed, regenerate a new key at https://console.groq.com

## 📞 Need Help?

1. Check the browser console for error messages
2. Verify your API key at https://console.groq.com
3. Make sure you're connected to the internet
4. Try with a fresh API key

## 🎉 Once Configured

After proper setup, you'll enjoy:
- 🤖 Real AI-powered material detection
- 🎨 Creative, unique craft suggestions
- ⚡ Fast responses (< 1 second)
- 🌟 Personalized recommendations

---

**Ready to create amazing crafts? Configure your API key and start crafting! ♻️✨**
