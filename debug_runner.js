const fs = require('fs');

process.on('uncaughtException', (err) => {
    fs.writeFileSync('crash_log.txt', 'Uncaught: ' + (err.stack || err));
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    fs.writeFileSync('crash_log.txt', 'Unhandled Rejection: ' + (reason.stack || reason));
    process.exit(1);
});

try {
    console.log("Requiring server...");
    require('./dist/shared/infrastructure/server.js');
    console.log("Require success.");
} catch (e) {
    fs.writeFileSync('crash_log.txt', 'Immediate: ' + (e.stack || e.toString()));
    process.exit(1);
}
