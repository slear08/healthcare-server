"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueListService = void 0;
const medical_queue_model_1 = __importDefault(require("../../models/medical_queue.model"));
const getQueueListService = async ({ status, sort, page = 1, limit = 10, search, purpose, }) => {
    let query = medical_queue_model_1.default.find({ deletedAt: null });
    // Add search functionality
    if (search) {
        const userQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };
        // First find matching users
        const matchingUsers = await medical_queue_model_1.default.db
            .model('User')
            .find(userQuery)
            .select('_id');
        const userIds = matchingUsers.map((user) => user._id);
        // Then construct the final query
        query = query.or([
            { _id: { $regex: search, $options: 'i' } },
            { userId: { $in: userIds } },
        ]);
    }
    // Add purpose filter
    if (purpose) {
        query = query.where('purpose', purpose);
    }
    // Add status filter
    if (status) {
        query = query.where('status', status);
    }
    // Populate user information
    query = query.populate({
        path: 'userId',
        select: 'name email profile',
        model: 'User',
    });
    if (sort) {
        const [field, order] = sort.split(':');
        const sortOrder = order === 'desc' ? -1 : 1;
        query = query.sort({ [field]: sortOrder });
    }
    const totalItems = await medical_queue_model_1.default.countDocuments(query.getQuery());
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const queueList = await query.skip(skip).limit(limit).exec();
    const formattedQueueList = queueList.map((queue) => {
        const queueObject = queue.toObject();
        const { userId, ...rest } = queueObject;
        return {
            ...rest,
            user: userId,
        };
    });
    return {
        queueList: formattedQueueList,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};
exports.getQueueListService = getQueueListService;
