import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import { User } from '../modules/auth/auth.model';
import config from '../config/config';
import AppError from '../errors/AppError';

const auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    //*checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }
    
    //* checking if the given token is valid
     const decoded = jwt.verify(
        token,
        config.jwt_access_secret,
      );
      
      const { role, email, iat } = decoded;

      //* checking if the user is exist
      const user = await User.isUserExistsByEmail(email);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
      }
  
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      req.user = decoded;
      
      next();

  });
};

export default auth;
