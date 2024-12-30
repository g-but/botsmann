import { exec } from 'child_process';

// Define the port your server uses
const port = 4000;

// Function to check if the port is in use and kill the process
function checkAndKillPort(port) {
    const command = process.platform === 'win32' ? `netstat -ano | findstr :${port}` : `lsof -ti :${port}`;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error checking port: ${stderr}`);
            return;
        }
        if (stdout) {
            console.log(`Command output: ${stdout}`);
            const pids = stdout.trim().split('\n').filter(pid => pid); // Handle multiple PIDs
            if (pids.length > 0) {
                const killCommands = pids.map(pid => {
                    const killCommand = process.platform === 'win32' ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;
                    return new Promise((resolve, reject) => {
                        exec(killCommand, (killErr, _, killStderr) => {
                            if (killErr) {
                                console.error(`Error killing process ${pid}: ${killStderr}`);
                                reject(killErr);
                            } else {
                                console.log(`Killed process ${pid} on port ${port}`);
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(killCommands)
                    .then(() => startServer())
                    .catch(() => console.error('Failed to kill some processes.'));
            } else {
                console.error('No valid PIDs found.');
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