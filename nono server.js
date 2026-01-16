const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET');
    next();
});

console.log('🔥 ChatGum 34 IDs Server Starting...');

// MT Manager se exact URL yahan paste karo
const REGISTER_URL = "https://api.chatgum.com/v1/auth/register";

async function createId(username, password) {
    try {
        const res = await axios.post(REGISTER_URL, {
            username,
            email: `${username}_${Date.now()}${Math.random().toString(36).slice(2)}@10minutemail.com`,
            password,
            dob: "1995-05-15",
            device_id: uuidv4(),
            platform: "android"
        }, {
            headers: {
                'User-Agent': 'Chatgum/2.5.1 (Linux; U; Android 13)',
                'Content-Type': 'application/json',
                'X-App-Version': '2.5.1'
            },
            timeout: 10000
        });
        console.log(`✅ ${username} created: ${res.data.user_id || 'OK'}`);
        return { success: true, username, user_id: res.data.user_id };
    } catch (error) {
        console.log(`❌ ${username} failed: ${error.message.slice(0,50)}`);
        return { success: false, username };
    }
}

app.post('/chatgum-34ids', async (req, res) => {
    const { username } = req.body;
    console.log(`\n🚀 34 IDs banane shuru: ${username}`);
    
    const allIds = [];
    
    // Main account
    allIds.push(await createId(username, "ChatGum@123"));
    
    // 33 Shadow accounts
    for (let i = 1; i <= 33; i++) {
        const shadowUser = `${username}${i}`;
        allIds.push(await createId(shadowUser, `ChatGum@123_${i}`));
        
        // Rate limiting (Chatgum ban nahi kare)
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    const successIds = allIds.filter(id => id.success);
    const status = {
        total_requested: 34,
        success: successIds.length,
        failed: 34 - successIds.length,
        main_id: username,
        all_ids: successIds.map(id => id.username),
        time: new Date().toISOString()
    };
    
    console.log(`✅ Complete: ${status.success}/34 IDs ready!`);
    res.json(status);
});

app.get('/status', (req, res) => {
    res.json({ server: 'ChatGum 34 IDs Ready', endpoint: '/chatgum-34ids' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🎉 ChatGum Server LIVE: http://localhost:${PORT}`);
    console.log(`📱 Test: curl -X POST http://localhost:${PORT}/chatgum-34ids -d '{"username":"user1"}'`);
});
