const analyticsData = {
    total_scans: 0,
    threats_detected: 0,
    scans_by_type: {
        url: 0,
        ip: 0,
        file: 0,
        search: 0
    },
    ai_engine_usage: {
        chatgpt: 0,
        deepseek: 0,
        both: 0
    }
};

exports.handler = async function(event, context) {
    if (event.httpMethod === 'POST') {
        // Log analytics data
        const { scan_type, engine_used, threat_detected } = JSON.parse(event.body);
        
        analyticsData.total_scans++;
        analyticsData.scans_by_type[scan_type]++;
        analyticsData.ai_engine_usage[engine_used]++;
        
        if (threat_detected) {
            analyticsData.threats_detected++;
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
                data: { message: 'Analytics logged successfully' }
            })
        };
    } else if (event.httpMethod === 'GET') {
        // Return analytics data
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                status: 'success',
                data: analyticsData
            })
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
};
