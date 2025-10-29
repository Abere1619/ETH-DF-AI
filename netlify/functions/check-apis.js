const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

exports.handler = async function(event, context) {
    try {
        const apiStatus = {
            chatgpt: { status: 'checking', message: 'Checking...' },
            deepseek: { status: 'checking', message: 'Checking...' }
        };

        // Check ChatGPT API
        try {
            const chatGPTKey = process.env.CHATGPT_API_KEY;
            if (!chatGPTKey) {
                apiStatus.chatgpt = { 
                    status: 'error', 
                    message: 'API key not configured' 
                };
            } else {
                const response = await fetch(CHATGPT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${chatGPTKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 5
                    })
                });
                
                if (response.ok) {
                    apiStatus.chatgpt = { 
                        status: 'success', 
                        message: 'Connected ✓' 
                    };
                } else {
                    apiStatus.chatgpt = { 
                        status: 'error', 
                        message: `API error: ${response.status}` 
                    };
                }
            }
        } catch (error) {
            apiStatus.chatgpt = { 
                status: 'error', 
                message: 'Connection failed' 
            };
        }

        // Check DeepSeek API
        try {
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) {
                apiStatus.deepseek = { 
                    status: 'error', 
                    message: 'API key not configured' 
                };
            } else {
                const response = await fetch(DEEPSEEK_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${deepSeekKey}`
                    },
                    body: JSON.stringify({
                        model: "deepseek-chat",
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 5
                    })
                });
                
                if (response.ok) {
                    apiStatus.deepseek = { 
                        status: 'success', 
                        message: 'Connected ✓' 
                    };
                } else {
                    apiStatus.deepseek = { 
                        status: 'error', 
                        message: `API error: ${response.status}` 
                    };
                }
            }
        } catch (error) {
            apiStatus.deepseek = { 
                status: 'error', 
                message: 'Connection failed' 
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                status: 'success',
                data: apiStatus
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: 'Internal server error: ' + error.message 
            })
        };
    }
};
