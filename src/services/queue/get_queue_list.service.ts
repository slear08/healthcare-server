import MedicalQueue from '../../models/medical_queue.model';

interface QueueListParams {
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
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
}: QueueListParams): Promise<PaginatedResponse> => {
  let query = MedicalQueue.find();

  if (status) {
    query = query.where('status', status);
  }

  if (sort) {
    const [field, order] = sort.split(':');
    const sortOrder = order === 'desc' ? -1 : 1;
    query = query.sort({ [field]: sortOrder });
  }

  const totalItems = await MedicalQueue.countDocuments(query.getQuery());

  const totalPages = Math.ceil(totalItems / limit);
  const skip = (page - 1) * limit;

  const queueList = await query.skip(skip).limit(limit).exec();

  return {
    queueList,
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
