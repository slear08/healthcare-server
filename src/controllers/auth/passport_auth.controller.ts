import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
  })(req, res, () => {
    res.redirect('/profile');
  });
};
