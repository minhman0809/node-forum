/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import bcrypt from 'bcrypt';
import models from '../../database/models';

const {
  User, Reply, Thread, Channel, Activity, Favorite
} = models;

class Mock {
  static async createUser() {
    const gender = ['male', 'female'];
    const newUser = await User.create({
      fullName: faker.name.findName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('password', 10),
      gender: faker.random.arrayElement(gender),
    });
    const { dataValues: user } = newUser;
    return user;
  }

  static async createChannel() {
    const name = faker.lorem.word();
    const newChannel = await Channel.create({
      name,
      slug: name,
    });
    const { dataValues: channel } = newChannel;
    return channel;
  }

  static async authUser(request, url, email) {
    const { body: { data: { token: authToken } } } = await request
      .post(url)
      .send({ email, password: 'password' });
    return authToken;
  }

  static async createThread(userId, channelId) {
    const newThread = await Thread.create({
      title: faker.lorem.words(),
      body: faker.lorem.paragraphs(),
      userId,
      channelId
    });
    const { dataValues: thread } = newThread;
    return thread;
  }

  static async findActivity(type, userId, subjectId, subjectType) {
    const newActivity = await Activity.findOne({
      where: {
        type, userId, subjectId, subjectType
      }
    });
    if (newActivity) {
      const { dataValues: activity } = newActivity;
      return activity;
    }
    return newActivity;
  }

  static async createActivity(type, userId, subjectId, subjectType) {
    const newActivity = await Activity.create({
      type, userId, subjectId, subjectType
    });
    const { dataValues: activity } = newActivity;
    return activity;
  }

  static async findAllActivity(type, userId, subjectId, subjectType) {
    const activity = await Activity.findAll({
      where: {
        type, userId, subjectId, subjectType
      }
    });
    return activity;
  }

  static async createReply(userId, threadId, times = null) {
    if (times) {
      const replies = [];
      for (let i = 0; i < times; i += 1) {
        const seedData = {
          userId,
          threadId,
          body: faker.lorem.sentences(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        replies.push(seedData);
      }
      const reply = await Reply.bulkCreate(replies, { returning: true });
      return reply;
    }
    const newReply = await Reply.create({
      body: faker.lorem.sentences(),
      userId,
      threadId
    });
    const { dataValues: reply } = newReply;
    return reply;
  }

  static async createFavorite(userId, favorableId, favorableType) {
    const newFavorite = await Favorite.create({
      userId, favorableId, favorableType
    });
    const { dataValues: favorite } = newFavorite;
    return favorite;
  }

  static async findFavorite(userId, favorableId, favorableType) {
    const getFavorite = await Favorite.findOne({
      where: {
        userId, favorableId, favorableType
      }
    });
    if (getFavorite) {
      const { dataValues: favorite } = getFavorite;
      return favorite;
    }
    return getFavorite;
  }

  static arrayColumn(input, ColumnKey, IndexKey = null) {
    if (input !== null && (typeof input === 'object' || Array.isArray(input))) {
      const newarray = [];
      if (typeof input === 'object') {
        const temparray = [];
        for (const key of Object.keys(input)) {
          temparray.push(input[key]);
        }
        // eslint-disable-next-line no-param-reassign
        input = temparray;
      }
      if (Array.isArray(input)) {
        for (const key of input.keys()) {
          if (IndexKey && input[key][IndexKey]) {
            if (ColumnKey) {
              newarray[input[key][IndexKey]] = input[key][ColumnKey];
            } else {
              newarray[input[key][IndexKey]] = input[key];
            }
          } else if (ColumnKey) {
            newarray.push(input[key][ColumnKey]);
          } else {
            newarray.push(input[key]);
          }
        }
      }
      // return Object.assign({}, newarray)
      return newarray;
    }
  }
}

export default Mock;
