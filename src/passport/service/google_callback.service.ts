import { Request, Response } from 'express';
import passport from 'passport';

export const GoogleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
  })(req, res, () => {
    res.redirect('/api/queue/list');
  });
};
