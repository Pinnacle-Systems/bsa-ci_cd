const { spawn } = require("child_process"); spawn("npm", ["run", "start:mobile"], { stdio: "inherit", shell: true }); spawn("npm", ["run", "start:backend"], { stdio: "inherit", shell: true }); 
