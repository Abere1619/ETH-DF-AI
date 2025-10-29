const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

exports.handler = async function(event, context) {
    const { action, key, value } = JSON.parse(event.body);
    
    if (action === 'set') {
        cache.set(key, {
            value: value,
            timestamp: Date.now()
        });
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ status: 'success' })
        };
    } else if (action === 'get') {
        cleanupCache();
        const cached = cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ 
                    status: 'success', 
                    data: { value: cached.value, cached: true } 
                })
            };
        } else {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ status: 'not_found' })
            };
        }
    }
};

function cleanupCache() {
    const now = Date.now();
    for (let [key, data] of cache.entries()) {
        if (now - data.timestamp > CACHE_TTL) {
            cache.delete(key);
        }
    }
}
