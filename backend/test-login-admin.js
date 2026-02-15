
const http = require('http');

function testAdminLogin() {
    const data = JSON.stringify({
        email: 'admin@bengaledu.com',
        password: 'admin123'
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('Sending admin login request...');

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ Admin login successful!');
                console.log('   Status:', res.statusCode);
                console.log('   Response:', responseBody);
            } else {
                console.error('❌ Admin login failed:');
                console.error('   Status:', res.statusCode);
                console.error('   Response:', responseBody);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request failed:', error.message);
    });

    req.write(data);
    req.end();
}

testAdminLogin();
