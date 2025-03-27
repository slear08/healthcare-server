import axios from 'axios';

import User from '../../models/user.model';

export async function SendSMSUtil(userId: string, message: string) {
  const user = await User.findById(userId);

  try {
    const response = await axios.post(
      process.env.SEMAPHORE_HOST!,
      new URLSearchParams({
        apikey: process.env.SEMAPHORE_API_KEY!,
        number: user?.mobileNumber || '',
        message: message,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}
