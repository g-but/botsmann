const { exec } = require('child_process');

// Define the port your server uses
const port = 4000;

// Function to check if the port is in use and kill the process
function checkAndKillPort(port) {
    const command = process.platform === 'win32' ? `netstat -ano | findstr :${port}` : `lsof -i :${port}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error checking port: ${stderr}`);
            return;
        }
        if (stdout) {
            console.log(`Command output: ${stdout}`);
            const lines = stdout.trim().split('\n');
            const pid = process.platform === 'win32' ? lines[lines.length - 1].trim().split(/\s+/)[4] : lines[0].trim().split(/\s+/)[1];
            console.log(`Extracted PID: ${pid}`);
            if (pid && !isNaN(pid)) {
                const killCommand = process.platform === 'win32' ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;
                exec(killCommand, (killErr, killStdout, killStderr) => {
                    if (killErr) {
                        console.error(`Error killing process: ${killStderr}`);
                        return;
                    }
                    console.log(`Killed process on port ${port}`);
                    startServer();
                });
            } else {
                console.error('PID not found or invalid.');
                startServer();
            }
        } else {
            startServer();
        }
    });
}

// Function to start the server
function startServer() {
    exec('node server.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting server: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
}
// Run the check and kill process
checkAndKillPort(port);