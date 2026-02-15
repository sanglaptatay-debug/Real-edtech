const http = require('http');

function testRegistration() {
    const email = `api.test.${Date.now()}@student.com`;
    const data = JSON.stringify({
        fullName: 'API Test Student',
        email: email,
        password: 'password123'
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('Sending registration request...');
    console.log(`   Email: ${email}`);

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log('✅ Registration successful!');
                console.log('   Status:', res.statusCode);
                console.log('   Response:', responseBody);
            } else {
                console.error('❌ Registration failed:');
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

testRegistration();
