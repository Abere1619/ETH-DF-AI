const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { type, inputValue, engine } = JSON.parse(event.body);

        // Validate input
        if (!type || !inputValue || !engine) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields: type, inputValue, engine' })
            };
        }

        let analysisResults = [];

        // ChatGPT Analysis
        if (engine === 'chatgpt' || engine === 'both') {
            try {
                const chatGPTResult = await callChatGPT(type, inputValue);
                if (chatGPTResult) {
                    analysisResults.push({
                        engine: 'ChatGPT',
                        result: chatGPTResult,
                        status: 'success'
                    });
                }
            } catch (error) {
                analysisResults.push({
                    engine: 'ChatGPT',
                    result: 'Analysis unavailable: ' + error.message,
                    status: 'error'
                });
            }
        }

        // DeepSeek Analysis
        if (engine === 'deepseek' || engine === 'both') {
            try {
                const deepSeekResult = await callDeepSeek(type, inputValue);
                if (deepSeekResult) {
                    analysisResults.push({
                        engine: 'DeepSeek',
                        result: deepSeekResult,
                        status: 'success'
                    });
                }
            } catch (error) {
                analysisResults.push({
                    engine: 'DeepSeek',
                    result: 'Analysis unavailable: ' + error.message,
                    status: 'error'
                });
            }
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
                data: {
                    analysis_results: analysisResults,
                    input_type: type,
                    input_value: inputValue,
                    engine_used: engine,
                    timestamp: new Date().toISOString()
                }
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

// ChatGPT API Call
async function callChatGPT(type, inputValue) {
    const prompt = createThreatAnalysisPrompt(type, inputValue);
    const apiKey = process.env.CHATGPT_API_KEY;

    if (!apiKey) {
        throw new Error('ChatGPT API key not configured');
    }

    const response = await fetch(CHATGPT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are ETH-DF CyberShield AI, an advanced threat intelligence platform. Analyze security threats with professional cybersecurity expertise. Provide structured, actionable analysis."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// DeepSeek API Call
async function callDeepSeek(type, inputValue) {
    const prompt = createThreatAnalysisPrompt(type, inputValue);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are ETH-DF CyberShield AI, an advanced threat intelligence platform. Analyze security threats with professional cybersecurity expertise. Provide structured, actionable analysis."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Create threat analysis prompt
function createThreatAnalysisPrompt(type, inputValue) {
    return `As ETH-DF CyberShield AI, analyze this ${type} for security threats:

Item: ${inputValue}
Type: ${type}

Provide a comprehensive threat analysis including:
1. Threat level assessment (Critical/High/Medium/Low)
2. Confidence score (0-100%)
3. Key indicators detected
4. Potential risks
5. Recommended actions
6. Technical explanation

Format the response in a structured way for a cybersecurity dashboard.`;
}
