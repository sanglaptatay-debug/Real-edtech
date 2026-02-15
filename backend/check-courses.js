const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function checkCourses() {
    try {
        console.log('Fetching courses...');
        const res = await axios.get(`${API_URL}/courses`);

        if (res.data.length === 0) {
            console.log('⚠️ No courses found in the database.');
            console.log('   This explains why the dropdown is empty.');
        } else {
            console.log(`✅ Found ${res.data.length} courses:`);
            res.data.forEach(c => console.log(`   - ${c.title} (ID: ${c._id})`));
        }
    } catch (error) {
        console.error('❌ Error fetching courses:', error.message);
    }
}

checkCourses();
