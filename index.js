let cron = require('node-cron');
let shell = require('shelljs');

cron.schedule("* * * * * *", function() {
    console.log('xin chao');
    if(shell.exec("node app.js").code !== 0) {
        console.log('Something went wrong here');
    }

});