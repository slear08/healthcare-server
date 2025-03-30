import { Request, Response } from 'express';
import passport from 'passport';

export const GoogleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
  })(req, res, () => {
    console.log('==========================================');
    console.log('ERROR', req);
    console.log('==========================================');
    res.redirect(process.env.CLIENT_URL!);
  });
};
