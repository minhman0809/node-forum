import models from '../../database/models';

const { Thread, Reply, User } = models;

class ThreadService {
  static async findAll() {
    const threads = await Thread.findAll();
    return threads;
  }

  static async findOne(id) {
    const thread = await Thread.findOne({
      where: { id },
      include: [
        {
          model: Reply,
          as: 'replies',
          include: [
            {
              attributes: {
                exclude: 'password'
              },
              model: User,
              as: 'user',
            }
          ]
        }
      ]
    });
    return thread;
  }
}

export default ThreadService;
