import FavoriteService from './FavoriteService';
import Response from '../../responses/response';

class FavoriteController {
  static async index(req, res) {
    res.status(200).json('Its works!!! Favorites');
  }

  static async favoriteReply(req, res) {
    const response = await FavoriteService.favoriteReply(req.user.id, req.params.replyId);
    return Response.httpResponse(res, response);
  }
}

export default FavoriteController;
