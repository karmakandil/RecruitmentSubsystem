# 🚀 Quick Start - Test Employee Profile API

## Step 1: Start the Server

```bash
npm run start:dev
```

Server will be available at: `http://localhost:5000`

## Step 2: Open Swagger UI

Navigate to: **http://localhost:5000/api/docs**

## Step 3: Login to Get Token

1. **Find `/auth/login` endpoint** in Swagger UI
2. **Click "Try it out"**
3. **Enter:**
   ```json
   {
     "employeeNumber": "EMP-2025-0013",
     "password": "password123"
   }
   ```
4. **Click "Execute"**
5. **Copy the `access_token`** from response

## Step 4: Authorize in Swagger

1. **Click "Authorize" button** (🔒 at top right)
2. **Enter:** `Bearer YOUR_ACCESS_TOKEN_HERE`
   - ⚠️ Include `Bearer ` (with space) before token!
3. **Click "Authorize"**
4. **Click "Close"**

## Step 5: Test Endpoints!

Now you can test any endpoint:
- ✅ `/employee-profile` - List employees
- ✅ `/employee-profile/me` - Get your profile
- ✅ `/employee-profile/stats` - Get statistics
- And all other endpoints!

## 🔑 Login Credentials

| Employee Number | Password | Role |
|----------------|----------|------|
| EMP-2025-0013 | password123 | SYSTEM_ADMIN (can do everything) |
| EMP-2025-0012 | password123 | HR_MANAGER |
| EMP-001 | password123 | DEPARTMENT_EMPLOYEE |

## ⚠️ Important Notes

1. **You MUST login first** - No token = 401 error
2. **Always include `Bearer `** before the token
3. **Token expires in 24 hours** - Login again if expired
4. **Use Swagger UI** - It's the easiest way to test!

## 🐛 Getting 401 Error?

See `TROUBLESHOOTING_401.md` for detailed help!

## 📚 More Help

- `LOGIN_INSTRUCTIONS.md` - Detailed login guide
- `MANUAL_TESTING_GUIDE.md` - Complete testing guide
- `TROUBLESHOOTING_401.md` - Fix 401 errors

Happy testing! 🎉

