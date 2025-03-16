import MedicalQueue from '../../models/medical_queue.model';

interface QueueListParams {
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  purpose?: string;
}

interface PaginatedResponse {
  queueList: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getQueueListService = async ({
  status,
  sort,
  page = 1,
  limit = 10,
  search,
  purpose,
}: QueueListParams): Promise<PaginatedResponse> => {
  let query = MedicalQueue.find({ deletedAt: null });

  // Add search functionality
  if (search) {
    const userQuery = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };

    // First find matching users
    const matchingUsers = await MedicalQueue.db
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

  const totalItems = await MedicalQueue.countDocuments(query.getQuery());
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
