import { v4 as uuidv4 } from 'uuid';

import User from '../../models/user.model';
import log from '../logger';

export async function SendSMSUtil(userId: string, message: string) {
  const user = await User.findById(userId);

  try {
    const response = await fetch('https://api.httpsms.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'x-api-Key': process.env.SMS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Hello ${user?.name}, ito ay paalala na kailangan mo na pong inumin mo ang gamot mo na ${message}. Maraming salamat!`,
        encrypted: false,
        from: process.env.SMS_SENDER_NUMBER!,
        request_id: uuidv4(),
        send_at: new Date().toISOString(),
        to: `${user?.mobileNumber}`,
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    log.error('Error sending SMS:', error);
    console.log(error);
    throw error;
  }
}
