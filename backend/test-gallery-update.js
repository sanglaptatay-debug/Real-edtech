const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@bengaledu.com';
const ADMIN_PASSWORD = 'Admin@123';

async function testUpdateLink() {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed with status: ${loginRes.status}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('   Login successful. Token received.');

        // 2. Get existing image to act on
        console.log('\n2. Finding an image to update...');
        let imageId;

        try {
            const galleryRes = await fetch(`${API_URL}/gallery`);
            if (!galleryRes.ok) throw new Error(`Gallery fetch failed: ${galleryRes.status}`);

            const galleryData = await galleryRes.json();

            if (galleryData.length > 0) {
                imageId = galleryData[0]._id;
                console.log(`   Found existing image ID: ${imageId}`);
            } else {
                console.log('   No images found to test update on. Please manually upload one first.');
                return;
            }
        } catch (e) {
            console.error('   Failed to fetch gallery:', e.message);
            return;
        }

        // 3. Try to hit the PUT endpoint
        console.log(`\n3. Testing PUT /api/gallery/${imageId}...`);
        try {
            // Using FormData for the update as the route expects it (upload.single('image'))
            // Note: In Node.js environment without 'formData' package, standard fetch might strictly behave differently with boundaries
            // But since we just want to test if the ROUTE exists (not necessarily succeed with file), let's send JSON first to check 404 vs 400/500/200
            // Actually, the route expects multipart/form-data. Let's send a raw request.

            // For simplicity in this environment, try sending a JSON body first. 
            // If the route exists, it might error with "Unexpected token" or handle the text fields, 
            // BUT it won't return 404 if the route matches.

            const updateRes = await fetch(`${API_URL}/gallery/${imageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ caption: "Updated from test script " + new Date().toISOString() })
            });

            console.log(`   Response Status: ${updateRes.status}`);

            if (updateRes.status === 404) {
                console.log('   ❌ RESULT: 404 NOT FOUND - The backend route is missing!');
            } else if (updateRes.ok) {
                const data = await updateRes.json();
                console.log('   ✅ RESULT: SUCCESS - Route exists and worked!');
                console.log('   Data:', data);
            } else {
                const text = await updateRes.text();
                console.log(`   ⚠️ RESULT: Error ${updateRes.status} (Route likely exists but rejected input)`);
                console.log('   Response:', text);
                // If it is 500 or 400, it confirms the route IS reachable, just maybe invalid input (since we didn't send form-data)
                if (updateRes.status !== 404) {
                    console.log('   ✅ VERDICT: Route exists (since it is not 404).');
                }
            }

        } catch (error) {
            console.log('   ❌ Request failed:', error.message);
        }

    } catch (error) {
        console.error('❌ Test failed unexpectedly:', error.message);
    }
}

testUpdateLink();
