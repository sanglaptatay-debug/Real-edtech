# MongoDB Atlas Connection Troubleshooting Guide

## Issue Diagnosed ✅

**Problem:** Cannot connect to MongoDB Atlas  
**Root Cause:** Network/Firewall blocking outbound connections to MongoDB Atlas on port 27017

## Test Results

1. ✅ **DNS Resolution**: `cluster1.jjorwmz.mongodb.net` resolves correctly
2. ❌ **Port 27017 Connection**: TCP connection FAILED (blocked by firewall/network)
3. ❌ **Ping Test**: ICMP blocked (normal for MongoDB Atlas)

**Error Message:** `ECONNREFUSED _mongodb._tcp.cluster1.jjorwmz.mongodb.net`

---

## Solutions (Try in Order)

### Option 1: Check MongoDB Atlas IP Whitelist (Most Common)

1. **Log into MongoDB Atlas**: https://cloud.mongodb.com
2. **Go to your cluster** → Click "Network Access" (left sidebar)
3. **Add IP Address**:
   - Click "ADD IP ADDRESS"
   - Option A: Click "ADD CURRENT IP ADDRESS" (recommended for testing)
   - Option B: Enter `0.0.0.0/0` to allow from anywhere (ONLY for testing!)
4. **Wait 2-3 minutes** for changes to propagate
5. **Test again**: Run `node test-db.js`

> [!WARNING]
> Using `0.0.0.0/0` allows connections from anywhere. Only use temporarily for testing, then restrict to your actual IP.

### Option 2: Check Windows Firewall

Your Windows Firewall might be blocking outbound MongoDB connections:

1. **Open Windows Defender Firewall**:
   ```
   Windows Key → Search "Windows Defender Firewall"
   ```

2. **Allow Node.js through firewall**:
   - Click "Allow an app through firewall"
   - Look for Node.js or npm
   - If not listed, click "Change settings" → "Allow another app"
   - Browse to: `C:\Program Files\nodejs\node.exe`
   - Check both "Private" and "Public"

3. **Test connection again**

### Option 3: Check Corporate/Network Firewall

If you're on a corporate network or using restrictive internet:

- **Corporate firewall** may block MongoDB Atlas (port 27017)
- **Ask IT department** to whitelist:
  - `*.mongodb.net` on port 27017
  - `*.mongodb.com` on port 27017

- **Alternative**: Use mobile hotspot or home network for testing

### Option 4: Check Antivirus/Security Software

Some antivirus programs block database connections:

- Temporarily disable antivirus
- Test MongoDB connection
- If it works, add Node.js to antivirus exceptions

### Option 5: Use MongoDB Compass to Test

Download **MongoDB Compass** (official MongoDB GUI):

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Install** and open
3. **Paste connection string**:
   ```
   mongodb+srv://sanglaptatay_db_user:Fghj@1987@cluster1.jjorwmz.mongodb.net/?appName=Cluster1
   ```
4. **Click Connect**

If Compass can't connect either, it confirms it's a network/firewall issue (not code).

---

## Quick Test Commands

After making changes, test with these commands:

```bash
# Test TCP connection to MongoDB
Test-NetConnection -ComputerName cluster1-shard-00-00.jjorwmz.mongodb.net -Port 27017

# Test MongoDB connection
cd backend
node test-db.js
```

**Expected successful output:**
```
✅ Successfully connected to MongoDB!
Database: bengal_education
```

---

## Current Workaround

Your platform is **fully functional with the mock server**:

**Keep using mock server for now:**
```bash
cd backend
node server-mock.js
```

Once MongoDB is accessible, switch to real server:
```bash
cd backend
npm run dev
```

---

## Connection String

Your connection string (with URL-encoded password):
```
mongodb+srv://sanglaptatay_db_user:Fghj%401987@cluster1.jjorwmz.mongodb.net/bengal_education?retryWrites=true&w=majority&appName=Cluster1
```

**Note:** The `@` in password is URL-encoded as `%40`

---

## Next Steps

1. **Most likely solution**: Add your IP to MongoDB Atlas whitelist
2. **Test**: Wait 2-3 minutes after adding IP, then run `node test-db.js`
3. **If still failing**: Check Windows Firewall
4. **If on corporate network**: Contact IT department

Need help with any of these steps? Let me know!
