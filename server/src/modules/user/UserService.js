import models from '../../database/models';
import Utils from '../../helpers/Utils';
import Token from '../../helpers/Token';
import Response from '../../responses/response';
import ActivityService from '../activity/ActivityService';

const { User } = models;
class UserService {
  static async findUserByEmail(email) {
    const user = await User.scope('withPassword').findOne({
      where: { email }
    });
    return UserService.refineObject(user);
  }

  static async findUserByName(fullName) {
    const user = await User.findOne({
      where: { fullName }
    });
    return UserService.refineObject(user);
  }

  static async findUserByNameWithActivityFeeds(fullName) {
    const resource = await User.findOne({ where: { fullName } });
    if (!resource) {
      return null;
    }
    const activities = await ActivityService.findAllActivityFeedsByUserId(resource.id);
    resource.setDataValue('activities', activities);

    return resource;
  }

  static refineObject(user) {
    if (!user) {
      return null;
    }
    const { dataValues: userObj } = user;
    return userObj;
  }

  static async login(request) {
    try {
      // check if the user exist in the database
      const user = await UserService.findUserByEmail(request.email);
      if (!user) {
        // if not, return a forbidden error
        return Response.failureResponseObject(403, 'Invalid user credentials');
      }
      // check if the user is verified
      // if (!user.dataValues.isVerified) {
      //   // if not, return a unauthorized error
      //   return Response.unauthorized(res, 'Please verify your account');
      // }
      const match = await Utils.comparePassword(request.password, user.password);
      if (!match) {
        // if not, return a forbidden error
        return Response.failureResponseObject(403, 'Invalid user credentials');
      }

      // remove user password for the user data
      // eslint-disable-next-line no-unused-vars
      const { password, ...logInUser } = user;
      // generate a token from the user data
      const token = await Token.generateToken(logInUser);
      // return a token
      return Response.successResponseObject({ token });
    } catch (error) {
      return Response.serverErrorResponseObject();
    }
  }
}

export default UserService;
