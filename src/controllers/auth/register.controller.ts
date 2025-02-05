import { NextFunction, Request, Response } from 'express';

import { registerUserService } from '../../services/auth/regiter.service';

export const registerAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUserService({ name, email, password });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
