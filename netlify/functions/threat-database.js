// Enhanced Threat Intelligence Database
const enhancedThreatIntelligence = {
    // IP Threat Database
    ips: {
        '196.188.171.48': {
            ip: '196.188.171.48',
            asn: 'AS24757',
            organization: 'Ethio Telecom',
            country: 'Ethiopia',
            city: 'Addis Ababa',
            risk_score: 77.3,
            signatureMatches: ['ETH-DF-RULE-001', 'ETH-DF-RULE-004'],
            threats: [
                { 
                    type: 'Phishing URL', 
                    severity: 'High', 
                    firstSeen: '2024-09-29', 
                    confidence: 77.3,
                    description: 'Hosting phishing pages mimicking banking login portals'
                },
                { 
                    type: 'Data Exfiltration', 
                    severity: 'Critical', 
                    firstSeen: '2024-10-24', 
                    confidence: 77.3,
                    description: 'Suspected C2 server for data exfiltration operations'
                }
            ],
            externalSources: [
                { name: 'VirusTotal', url: 'https://www.virustotal.com/gui/ip-address/196.188.171.48' },
                { name: 'AbuseIPDB', url: 'https://www.abuseipdb.com/check/196.188.171.48' },
                { name: 'GreyNoise', url: 'https://www.greynoise.io/viz/ip/196.188.171.48' }
            ],
            recommendations: [
                'Block this IP in firewall rules',
                'Monitor for any communication attempts',
                'Update threat intelligence feeds'
            ]
        },
        '185.220.101.33': {
            ip: '185.220.101.33',
            asn: 'AS200593',
            organization: 'TOR Network',
            country: 'Germany',
            city: 'Frankfurt',
            risk_score: 95.8,
            signatureMatches: ['ETH-DF-RULE-005'],
            threats: [
                { 
                    type: 'TOR Exit Node', 
                    severity: 'High', 
                    firstSeen: '2024-01-15', 
                    confidence: 99.9,
                    description: 'Known TOR exit node - potential anonymity abuse'
                }
            ],
            recommendations: [
                'Monitor for suspicious traffic patterns',
                'Consider blocking in sensitive environments',
                'Log all connection attempts'
            ]
        }
    },
    
    // Domain Threat Database
    domains: {
        'secure-login.bank-verification.com': {
            domain: 'secure-login.bank-verification.com',
            creation_date: '2024-09-20',
            registrar: 'NameCheap, Inc.',
            risk_score: 88.2,
            threats: [
                {
                    type: 'Phishing',
                    severity: 'Critical',
                    confidence: 92.5,
                    description: 'Mimics legitimate banking login portals'
                }
            ],
            recommendations: [
                'Block access to this domain',
                'Educate users about phishing attempts',
                'Report to domain registrar'
            ]
        }
    },
    
    // File Hash Database
    hashes: {
        'eicar_test_md5': {
            hash: '44d88612fea8a8f36de82e1278abb02f',
            filename: 'eicar_test.txt',
            type: 'Test File',
            risk_score: 0,
            description: 'Standard anti-virus test file - harmless'
        }
    }
};

// Enhanced Signature Rules
const enhancedSignatureRules = {
    'ETH-DF-RULE-001': {
        id: 'ETH-DF-RULE-001',
        name: 'Malicious IP Pattern Detection',
        description: 'Detects IP addresses associated with known malicious activities based on behavioral patterns and threat intelligence correlation.',
        tags: ['IP Analysis', 'Behavioral', 'Threat Correlation'],
        severity: 'High',
        confidence: 95.2,
        lastUpdated: '2025-01-15',
        conditions: ['IP in known threat databases', 'Suspicious port activity', 'Geolocation anomalies']
    },
    'ETH-DF-RULE-002': {
        id: 'ETH-DF-RULE-002',
        name: 'Phishing URL Pattern Recognition',
        description: 'Identifies phishing URLs through lexical analysis, domain age checking, and pattern matching against known phishing campaigns.',
        tags: ['URL Analysis', 'Phishing', 'Pattern Matching'],
        severity: 'Critical',
        confidence: 97.8,
        lastUpdated: '2025-01-10',
        conditions: ['Domain age < 30 days', 'Suspicious keywords in URL', 'SSL certificate anomalies']
    },
    'ETH-DF-RULE-003': {
        id: 'ETH-DF-RULE-003',
        name: 'Malware File Signature Detection',
        description: 'Detects malware files through signature matching, behavioral analysis, and machine learning classification.',
        tags: ['File Analysis', 'Malware', 'Machine Learning'],
        severity: 'High',
        confidence: 98.3,
        lastUpdated: '2025-01-12',
        conditions: ['Known malicious signatures', 'Suspicious file structure', 'Behavioral indicators']
    },
    'ETH-DF-RULE-004': {
        id: 'ETH-DF-RULE-004',
        name: 'C2 Communication Detection',
        description: 'Identifies command and control communication patterns and beaconing behavior.',
        tags: ['Network Analysis', 'C2 Detection', 'Behavioral'],
        severity: 'Critical',
        confidence: 96.1,
        lastUpdated: '2025-01-18',
        conditions: ['Regular beaconing intervals', 'Encoded communication', 'Suspicious protocols']
    },
    'ETH-DF-RULE-005': {
        id: 'ETH-DF-RULE-005',
        name: 'Anonymity Network Detection',
        description: 'Detects connections from TOR exit nodes and other anonymity services.',
        tags: ['Network Analysis', 'Anonymity', 'Reputation'],
        severity: 'High',
        confidence: 99.9,
        lastUpdated: '2025-01-14',
        conditions: ['Known TOR exit nodes', 'VPN service IP ranges', 'Proxy server detection']
    }
};
