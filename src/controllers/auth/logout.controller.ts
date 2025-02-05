import { NextFunction, Request, Response } from 'express';

// Logout Controller
export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
