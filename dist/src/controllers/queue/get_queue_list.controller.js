"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueListController = void 0;
const get_queue_limit_helper_1 = require("../../helper/get_queue_limit.helper");
const get_queue_list_service_1 = require("../../services/queue/get_queue_list.service");
const http_error_1 = require("../../utils/http-error");
const getQueueListController = async (req, res, next) => {
    try {
        const { status, sort, page, limit, search, purpose } = req.query;
        const params = {
            status: typeof status === 'string' ? status : undefined,
            sort: typeof sort === 'string' ? sort : undefined,
            search: typeof search === 'string' ? search : undefined,
            page: page ? Math.max(1, parseInt(page)) : 1,
            purpose: typeof purpose === 'string' ? purpose : undefined,
            limit: limit ? Math.min(100, Math.max(1, parseInt(limit))) : 10,
        };
        if (params.status &&
            !['waiting', 'in-progress', 'completed', 'cancelled'].includes(params.status)) {
            throw new http_error_1.HttpError(400, 'Invalid status parameter. Must be one of: waiting, in-progress, completed');
        }
        if (params.sort) {
            const [field, order] = params.sort.split(':');
            if (!['createdAt', 'userId', 'status'].includes(field) ||
                !['asc', 'desc'].includes(order)) {
                throw new http_error_1.HttpError(400, 'Invalid sort parameter. Format should be field:order, e.g., createdAt:desc');
            }
        }
        if (isNaN(params.page) || isNaN(params.limit)) {
            throw new http_error_1.HttpError(400, 'Invalid pagination parameters. Page and limit must be valid numbers');
        }
        const { queueList, pagination } = await (0, get_queue_list_service_1.getQueueListService)(params);
        const queueLimitStatus = await (0, get_queue_limit_helper_1.getQueueLimitHelper)();
        res.json({
            queueLimitStatus,
            queueList,
            pagination,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getQueueListController = getQueueListController;
