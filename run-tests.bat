@echo off
echo Testing Hospital Management System API
echo =====================================

echo.
echo 1. Testing Database Connection...
node test-database.js

echo.
echo 2. Testing Statistics Endpoint...
node test-statistics.js

echo.
echo 3. Open test-connection.html in your browser to test from client side
echo.
pause