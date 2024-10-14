const axios = require('axios');

const sendRequest = (ip, path) => {
    return axios.get(`http://localhost:3005${path}`, { headers: { 'X-Forwarded-For': ip } })
        .catch(err => console.error(`Error for IP: ${ip} and path: ${path} - ${err.message}`));
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const simulateDdos = async () => {
    const ips = [
        '65.189.121.118', '197.72.99.206', '149.38.22.93', '144.76.55.23', 
        '98.235.100.2', '123.45.67.89', '41.76.99.10', '156.75.98.34'
    ];
    
    const paths = ['/path1', '/path2', '/path3', '/path4', '/path5'];
    
    for (let i = 0; i < 50; i++) {
        const randomIp = ips[Math.floor(Math.random() * ips.length)];
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        
        sendRequest(randomIp, randomPath);
        await delay(500);
    }

    console.log('All requests sent');
};

simulateDdos().catch(console.error);
