const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json());

// MT Manager سے exact URLs paste کریں
const CHATGUM_REGISTER = process.env.REGISTER_URL || "https://api.chatgum.com/v1/auth/register";

async function createChatgumId(username, password) {
    const payload = {
        username,
        email: `${username}_${uuidv4().slice(0,8)}@tempmail.lol`,
        password,
        dob: "1990-01-01",
        device_id: uuidv4(),
        app_version: "2.5.1"
    };
    
    try {
        const res = await axios.post(CHATGUM_REGISTER, payload, {
            headers: {
                'User-Agent': 'Chatgum/2.5.1 (Android 13)',
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch(e) {
        console.error(`Failed ${username}:`, e.response?.data);
        return null;
    }
}

app.post('/create-34ids', async (req, res) => {
    const { main_username } = req.body;
    console.log(`🚀 Creating 34 IDs for: ${main_username}`);
    
    // 1. Main ID
    const mainId = await createChatgumId(main_username, "ChatgumPass123!");
    
    // 2. 33 Shadow IDs
    const shadowIds = [];
    for(let i = 1; i <= 33; i++) {
        const shadowName = `${main_username}${i}`;
        const shadowId = await createChatgumId(shadowName, `ChatgumPass123!_${i}`);
        if(shadowId) shadowIds.push(shadowName);
        
        // Rate limit (Chatgum ban نہ کرے)
        await new Promise(r => setTimeout(r, 3500 + Math.random()*1500));
    }
    
    res.json({
        success: true,
        main_id: mainId?.user_id,
        shadow_ids: shadowIds,
        total: 1 + shadowIds.length,
        server_url: process.env.RAILWAY_URL
    });
    
    console.log(`✅ ${1 + shadowIds.length} IDs created!`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Railway Server: https://your-app.railway.app/create-34ids`);
});
