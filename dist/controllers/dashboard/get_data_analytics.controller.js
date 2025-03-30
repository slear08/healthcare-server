"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataAnalyticsController = getDataAnalyticsController;
const get_data_analytics_service_1 = require("../../services/dashboard/get_data_analytics.service");
async function getDataAnalyticsController(req, res, next) {
    try {
        const result = await (0, get_data_analytics_service_1.getDataAnalyticsService)();
        res.json({ message: 'Total users fetched', data: result });
    }
    catch (error) {
        next(error);
    }
}
