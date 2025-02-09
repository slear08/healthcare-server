import USER_TYPE from '../../constant/user_type.constant';
import User from '../../models/user.model';

export async function getTotalUsersService() {
  const totalUsers = await User.countDocuments({ role: USER_TYPE.USER });
  return { totalUsers };
}
