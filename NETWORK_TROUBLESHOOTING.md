# Network Troubleshooting Guide

## Issue: Dashboard counts not showing on other PCs

### Root Cause
The frontend was using `http://localhost:5000` which only works on the local machine. Other PCs need to use the actual server IP address.

### Fixed Components
1. **Frontend/src/pages/Page.tsx** - Updated to use statistics API endpoint
2. **Frontend/src/components/DashboardCharts.tsx** - Updated API URLs
3. **Frontend/src/pages/PatientProfile.tsx** - Updated API URLs
4. **Backend/models/Statistics.js** - Fixed database queries and error handling
5. **Backend/index.js** - Improved CORS and logging

### Testing Steps

#### 1. Test from Server Machine
```bash
# Navigate to backend directory
cd backend

# Start the server
node index.js

# You should see:
# Server is running on http://0.0.0.0:5000
# Server accessible at:
#   - Local: http://localhost:5000
#   - Network: http://192.168.50.171:5000
```

#### 2. Test from Other PCs
1. Open `test-connection.html` in a web browser
2. Click "Test Basic Connection" - should show ✅ success
3. Click "Test Statistics API" - should show dashboard counts
4. Click "Test All Endpoints" - should test all API endpoints

#### 3. Manual API Testing
Open browser and navigate to:
- `http://192.168.50.171:5000/test` - Basic connectivity test
- `http://192.168.50.171:5000/statistics` - Dashboard statistics
- `http://192.168.50.171:5000/health` - Health check

### Common Issues and Solutions

#### Issue 1: Connection Refused
**Symptoms:** Cannot connect to server from other PCs
**Solutions:**
1. Ensure server is running on the host machine
2. Check Windows Firewall settings
3. Verify the IP address (192.168.50.171) is correct
4. Ensure all devices are on the same network

#### Issue 2: CORS Errors
**Symptoms:** Browser console shows CORS policy errors
**Solutions:**
1. Server now configured with permissive CORS policy
2. If still issues, check browser developer tools for specific errors

#### Issue 3: Database Connection Issues
**Symptoms:** API returns 500 errors or "Database connection failed"
**Solutions:**
1. Check database server (192.168.50.210) is accessible
2. Verify database credentials in `backend/db.js`
3. Ensure SQL Server is running and accepting connections

#### Issue 4: Empty Dashboard Counts
**Symptoms:** Dashboard shows 0 for all counts
**Solutions:**
1. Check if data exists in database tables
2. Verify table names match the queries in Statistics.js
3. Check browser network tab for API response data

### Network Configuration

#### Server Configuration
- **Backend Server:** 192.168.50.171:5000
- **Database Server:** 192.168.50.210
- **Frontend:** Served from any machine, connects to backend

#### Required Ports
- **5000:** Backend API server
- **1433:** SQL Server (default)

### Verification Commands

#### From Command Line (Windows)
```cmd
# Test network connectivity
ping 192.168.50.171

# Test port connectivity
telnet 192.168.50.171 5000

# Test API endpoint
curl http://192.168.50.171:5000/test
```

#### From PowerShell
```powershell
# Test network connectivity
Test-NetConnection -ComputerName 192.168.50.171 -Port 5000

# Test API endpoint
Invoke-RestMethod -Uri "http://192.168.50.171:5000/test"
```

### Monitoring and Logs

#### Backend Logs
The server now logs all incoming requests with timestamps and client IPs:
```
[2025-08-08T08:30:00.000Z] GET /statistics - Client: 192.168.50.100
[2025-08-08T08:30:01.000Z] GET /birthRecords - Client: 192.168.50.100
```

#### Browser Developer Tools
1. Open F12 Developer Tools
2. Go to Network tab
3. Refresh the dashboard page
4. Check for failed requests (red entries)
5. Click on failed requests to see error details

### Configuration Files

#### API Configuration
Created `frontend/src/config/api.ts` for centralized API URL management.

To change the server IP address, update this file instead of searching through all components.

### Support

If issues persist:
1. Check the server console logs for errors
2. Use the test-connection.html page to diagnose specific issues
3. Verify network connectivity between machines
4. Check Windows Firewall and antivirus settings