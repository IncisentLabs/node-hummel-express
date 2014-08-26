var hummel = require('hummel'),
    settings = hummel.getSettings(),
    log = hummel.getLogger(),
    cluster = require('cluster'),
    express = require('express');

module.exports = {

    createServer: function(opts) {
        var serverOpts = hummel.getOptions(opts),
            port = serverOpts.port || settings.port,
            app = express();

        app.get('/healthcheck', function(req, res) {
            res.send("OK");
        });

        app.run = function() {
            if (cluster.isMaster && opts.workers > 1) {
                for (var i = 1; i <= opts.workers; i++) {
                    log.info('Starting worker #' + i);
                    cluster.fork();
                }
            } else {
                app.listen(port);

                log.info('Running in ' + settings.environment + ' mode.');
                log.info('Server running on: http://localhost:' + port);
            }
        };

        return app;
    }
};
