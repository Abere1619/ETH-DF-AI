// Enhanced Analytics Tracking
async function trackAnalytics(scanType, engineUsed, threatDetected) {
    try {
        await fetch(`${NETLIFY_FUNCTIONS_URL}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scan_type: scanType,
                engine_used: engineUsed,
                threat_detected: threatDetected
            })
        });
    } catch (error) {
        console.log('Analytics tracking failed:', error);
    }
}

// Enhanced Threat Lookup
function enhancedThreatLookup(type, value) {
    switch(type) {
        case 'ip':
            return enhancedThreatIntelligence.ips[value];
        case 'url':
            const domain = extractDomain(value);
            return enhancedThreatIntelligence.domains[domain];
        case 'file':
            // Hash-based lookup would go here
            return null;
        default:
            return null;
    }
}

function extractDomain(url) {
    try {
        const domain = new URL(url).hostname;
        return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch {
        return url;
    }
}

// Enhanced Results Display
function displayEnhancedResults(analysisData, type, inputValue, container) {
    const localThreatData = enhancedThreatLookup(type, inputValue);
    
    let resultsHTML = '';
    
    if (localThreatData) {
        resultsHTML += generateThreatReport(localThreatData, type);
    }
    
    analysisData.analysis_results.forEach((analysis, index) => {
        const statusClass = analysis.status === 'success' ? 'result-clean' : 'result-suspicious';
        const icon = analysis.engine === 'ChatGPT' ? 'fab fa-openai' : 'fas fa-rocket';
        
        resultsHTML += `
            <div class="result-item ${statusClass}">
                <div class="result-icon">
                    <i class="${icon}"></i>
                </div>
                <div>
                    <h4>${analysis.engine} Analysis Complete</h4>
                    <p>Secure backend processing</p>
                </div>
            </div>
            
            <div style="margin-top: 1rem; padding: 1.5rem; background: rgba(15, 23, 42, 0.5); border-radius: 8px; ${index < analysisData.analysis_results.length - 1 ? 'margin-bottom: 1rem;' : ''}">
                <h4>${analysis.engine} Threat Analysis:</h4>
                <div style="white-space: pre-wrap; line-height: 1.6;">${analysis.result}</div>
            </div>
        `;
    });

    container.innerHTML = resultsHTML + `
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(56, 161, 105, 0.1); border-radius: 8px; border: 1px solid rgba(56, 161, 105, 0.3);">
            <p><i class="fas fa-shield-alt" style="color: #68d391;"></i> Analysis completed through secure Netlify Functions</p>
            <p><i class="fas fa-lock" style="color: #68d391;"></i> API keys protected in environment variables</p>
        </div>
    `;
    
    // Track analytics
    const threatDetected = localThreatData && localThreatData.risk_score > 50;
    trackAnalytics(type, analysisData.engine_used, threatDetected);
}

function generateThreatReport(threatData, type) {
    let reportHTML = `
        <div class="result-item ${threatData.risk_score > 70 ? 'result-malicious' : threatData.risk_score > 30 ? 'result-suspicious' : 'result-clean'}">
            <div class="result-icon">
                <i class="fas fa-${threatData.risk_score > 70 ? 'skull-crossbones' : threatData.risk_score > 30 ? 'exclamation-triangle' : 'check-circle'}"></i>
            </div>
            <div>
                <h4>Local Threat Intelligence Match</h4>
                <p>Risk Score: ${threatData.risk_score}% | ${threatData.threats?.length || 0} threats detected</p>
            </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 1.5rem; background: rgba(15, 23, 42, 0.8); border-radius: 8px; border-left: 4px solid var(--ai-color);">
            <h4><i class="fas fa-database"></i> ETH-DF Threat Intelligence</h4>
    `;
    
    if (type === 'ip') {
        reportHTML += `
            <p><strong>IP:</strong> ${threatData.ip}</p>
            <p><strong>Organization:</strong> ${threatData.organization} (${threatData.asn})</p>
            <p><strong>Location:</strong> ${threatData.city}, ${threatData.country}</p>
        `;
    } else if (type === 'url') {
        reportHTML += `
            <p><strong>Domain:</strong> ${threatData.domain}</p>
            <p><strong>Registrar:</strong> ${threatData.registrar}</p>
            <p><strong>Creation Date:</strong> ${threatData.creation_date}</p>
        `;
    }
    
    if (threatData.threats && threatData.threats.length > 0) {
        reportHTML += `<div style="margin-top: 1rem;"><strong>Detected Threats:</strong><ul style="margin-top: 0.5rem;">`;
        threatData.threats.forEach(threat => {
            reportHTML += `<li>${threat.type} (${threat.severity}) - ${threat.description}</li>`;
        });
        reportHTML += `</ul></div>`;
    }
    
    if (threatData.recommendations && threatData.recommendations.length > 0) {
        reportHTML += `<div style="margin-top: 1rem;"><strong>Recommendations:</strong><ul style="margin-top: 0.5rem;">`;
        threatData.recommendations.forEach(rec => {
            reportHTML += `<li>${rec}</li>`;
        });
        reportHTML += `</ul></div>`;
    }
    
    reportHTML += `</div>`;
    return reportHTML;
}
