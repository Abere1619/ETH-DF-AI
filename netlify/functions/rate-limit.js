const rateLimitMap = new Map();

exports.handler = async function(event, context) {
    const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100; // Maximum requests per window
    
    // Clean up old entries
    cleanupRateLimit();
    
    // Get or create client data
    let clientData = rateLimitMap.get(clientIP) || { count: 0, firstRequest: now };
    
    // Check if window has passed
    if (now - clientData.firstRequest > windowMs) {
        clientData = { count: 1, firstRequest: now };
    } else {
        clientData.count += 1;
    }
    
    rateLimitMap.set(clientIP, clientData);
    
    // Check if over limit
    if (clientData.count > maxRequests) {
        return {
            statusCode: 429,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: 'Rate limit exceeded. Please try again later.'
            })
        };
    }
    
    // Proceed with request
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': (maxRequests - clientData.count).toString(),
            'X-RateLimit-Reset': (clientData.firstRequest + windowMs).toString()
        },
        body: JSON.stringify({
            status: 'success',
            data: {
                rate_limit: {
                    limit: maxRequests,
                    remaining: maxRequests - clientData.count,
                    reset: clientData.firstRequest + windowMs
                }
            }
        })
    };
};

function cleanupRateLimit() {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    
    for (let [ip, data] of rateLimitMap.entries()) {
        if (now - data.firstRequest > windowMs) {
            rateLimitMap.delete(ip);
        }
    }
}
