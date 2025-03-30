"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const medical_queue_model_1 = __importDefault(require("../../../models/medical_queue.model"));
const get_queue_list_service_1 = require("../../queue/get_queue_list.service");
globals_1.jest.mock('../../../models/medical_queue.model');
describe('getQueueListService', () => {
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
    });
    const mockQueueList = [
        {
            _id: '1',
            userId: {
                _id: 'user1',
                name: 'Test User 1',
                email: 'test1@example.com',
                profile: 'profile1',
            },
            status: 'waiting',
            purpose: 'checkup',
            timeSchedule: new Date(),
            toObject: globals_1.jest.fn().mockReturnThis(),
        },
        {
            _id: '2',
            userId: {
                _id: 'user2',
                name: 'Test User 2',
                email: 'test2@example.com',
                profile: 'profile2',
            },
            status: 'completed',
            purpose: 'medicine-request',
            timeSchedule: new Date(),
            toObject: globals_1.jest.fn().mockReturnThis(),
        },
    ];
    const mockQuery = {
        getQuery: globals_1.jest.fn().mockReturnValue({}),
        or: globals_1.jest.fn().mockReturnThis(),
        where: globals_1.jest.fn().mockReturnThis(),
        populate: globals_1.jest.fn().mockReturnThis(),
        sort: globals_1.jest.fn().mockReturnThis(),
        skip: globals_1.jest.fn().mockReturnThis(),
        limit: globals_1.jest.fn().mockReturnThis(),
        exec: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockQueueList)),
    };
    beforeEach(() => {
        medical_queue_model_1.default.find.mockReturnValue(mockQuery);
        medical_queue_model_1.default.countDocuments.mockReturnValue(Promise.resolve(2));
    });
    it('should return paginated queue list with default parameters', async () => {
        const result = await (0, get_queue_list_service_1.getQueueListService)({});
        expect(medical_queue_model_1.default.find).toHaveBeenCalledWith({ deletedAt: null });
        expect(result).toEqual({
            queueList: mockQueueList.map(({ userId, ...queue }) => ({
                ...queue,
                user: userId,
            })),
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 2,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        });
    });
    it('should apply search filter', async () => {
        const search = 'test';
        const mockUsers = [{ _id: 'user1' }, { _id: 'user2' }];
        const mockUserModel = {
            find: globals_1.jest.fn().mockReturnValue({
                select: globals_1.jest.fn().mockReturnValue(Promise.resolve(mockUsers)),
            }),
        };
        medical_queue_model_1.default.db.model.mockReturnValue(mockUserModel);
        await (0, get_queue_list_service_1.getQueueListService)({ search });
        expect(medical_queue_model_1.default.db.model).toHaveBeenCalledWith('User');
        expect(mockQuery.or).toHaveBeenCalledWith([
            { _id: { $regex: search, $options: 'i' } },
            { userId: { $in: ['user1', 'user2'] } },
        ]);
    });
    it('should apply status and purpose filters', async () => {
        await (0, get_queue_list_service_1.getQueueListService)({
            status: 'waiting',
            purpose: 'checkup',
        });
        expect(mockQuery.where).toHaveBeenCalledWith('purpose', 'checkup');
        expect(mockQuery.where).toHaveBeenCalledWith('status', 'waiting');
    });
    it('should apply sorting', async () => {
        await (0, get_queue_list_service_1.getQueueListService)({
            sort: 'timeSchedule:desc',
        });
        expect(mockQuery.sort).toHaveBeenCalledWith({ timeSchedule: -1 });
    });
    it('should handle pagination', async () => {
        await (0, get_queue_list_service_1.getQueueListService)({
            page: 2,
            limit: 5,
        });
        expect(mockQuery.skip).toHaveBeenCalledWith(5);
        expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
    it('should populate user information', async () => {
        await (0, get_queue_list_service_1.getQueueListService)({});
        expect(mockQuery.populate).toHaveBeenCalledWith({
            path: 'userId',
            select: 'name email profile',
            model: 'User',
        });
    });
});
