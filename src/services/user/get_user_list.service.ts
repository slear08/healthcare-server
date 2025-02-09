import USER_TYPE from '../../constant/user_type.constant';
import User from '../../models/user.model';

export async function getUserListService() {
  return await User.find({ role: USER_TYPE.USER }).select('-password'); // Exclude password
}
