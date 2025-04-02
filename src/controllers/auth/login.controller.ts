import { NextFunction, Request, Response } from 'express';

import { loginUserService } from '../../services/auth/login.service';

export const loginAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);

    const maxAge = process.env.JWT_MAX_AGE
      ? parseInt(process.env.JWT_MAX_AGE, 10)
      : 60 * 60 * 1000;

    res.cookie('token', result.auth.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'staging',
      sameSite: 'none',
      maxAge,
    });

    res.cookie('refreshToken', result.auth.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'staging',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
