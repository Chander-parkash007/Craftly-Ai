# 🚀 Push Craftly AI to GitHub

## Step-by-Step Instructions

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon in the top right
3. Click **"New repository"**
4. Fill in:
   - **Repository name**: `craftly-ai` (or your preferred name)
   - **Description**: `AI-powered app that turns household waste into creative DIY crafts`
   - **Visibility**: Public (for Devpost submission)
   - **DO NOT** check "Initialize with README" (you already have one)
5. Click **"Create repository"**

---

### Step 2: Add All Files to Git

Open your terminal in the project folder and run:

```bash
git add .
```

This stages all your files for commit.

---

### Step 3: Commit Your Changes

```bash
git commit -m "Initial commit: Craftly AI - AI-powered upcycling app"
```

---

### Step 4: Connect to GitHub Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/craftly-ai.git
```

**Example:**
```bash
git remote add origin https://github.com/chanderparkash/craftly-ai.git
```

---

### Step 5: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)

---

### Step 6: Verify Upload

1. Go to your GitHub repository URL
2. You should see all your files
3. Copy the repository URL for Devpost

---

## 🔐 If You Need a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Craftly AI Upload`
4. Check: `repo` (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## 📋 Complete Command Sequence

Copy and paste these commands one by one:

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit: Craftly AI - AI-powered upcycling app"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/craftly-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## ⚠️ Important: Protect Your API Key

Your `.env` file is already in `.gitignore`, so your API key won't be uploaded. ✅

Verify by checking `.gitignore` contains:
```
.env
```

---

## 🎯 After Pushing

Your GitHub URL will be:
```
https://github.com/YOUR_USERNAME/craftly-ai
```

Use this URL in your Devpost submission under "Try it out" links!

---

## 🐛 Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/craftly-ai.git
```

### Error: "failed to push some refs"

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Authentication failed

Use a Personal Access Token instead of your password (see instructions above).

---

## ✅ Success Indicators

You'll know it worked when:
1. Terminal shows "Branch 'main' set up to track remote branch 'main'"
2. You can see all files on GitHub
3. README.md displays on the repository page

---

**Ready to push? Follow the steps above!** 🚀
