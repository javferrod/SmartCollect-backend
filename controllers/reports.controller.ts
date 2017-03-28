const router = require('express').Router();
const Report = require('../models/Report');
const GraphNode = require('../models/GraphNode');

router.get('/', function (req, res) {

    Report.find().then(function (reports) {
        res.json(reports);
    }).catch(function (error) {
        console.error(error)
    })

});

router.post('/container/:container_id', function (req, res) {
    let containerId = req.params.container_id;
    let data = req.body;

    GraphNode.findOne({id: containerId})
        .then(function (container) {
            let report = new Report();

            report.email = data.email;
            report.name = data.name;
            report.type = data.type;
            report.body = data.body;

            report.container = container;

            container.reports.push(report);

            return report.save()
                .then(function () {
                    container.save();
                });
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(404);
        })
});

router.post('/mark/:report_id', function (req, res) {
    let id = req.params.report_id;

    Report.findOne({_id: id})
        .then(function (report) {
            report.seen = true;
            return report.save();
        })
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(404);
        });
});

module.exports = router;
