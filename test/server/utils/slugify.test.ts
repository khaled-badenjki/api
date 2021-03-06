import * as mongoose from 'mongoose';
import User from '../../../src/models/User';
import { generateSlug } from '../../../src/utils/slugify';

// eslint-disable-next-line
require('dotenv').config();

describe('slugify', () => {
  beforeAll(async (done) => {
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGO_URL_TEST, options);

    const mockUsers = [
      {
        slug: 'john',
        email: 'john@example.com',
        createdAt: new Date(),
        displayName: 'abc',
        avatarUrl: 'def',
      },
      {
        slug: 'john-johnson',
        email: 'john-johnson@example.com',
        createdAt: new Date(),
        displayName: 'abc',
        avatarUrl: 'def',
      },
      {
        slug: 'john-johnson-1',
        email: 'john-johnson-1@example.com',
        createdAt: new Date(),
        displayName: 'abc',
        avatarUrl: 'def',
      },
    ];

    await User.insertMany(mockUsers);

    done();
  });

  test('not duplicated', async () => {
    expect.assertions(1);

    await expect(generateSlug(User, 'John J Johnson@#$')).resolves.toEqual('john-j-johnson');
  });

  test('one time duplicated', async () => {
    expect.assertions(1);

    await expect(generateSlug(User, ' John@#$')).resolves.toEqual('john-1');
  });

  test('multiple duplicated', async () => {
    expect.assertions(1);

    await expect(generateSlug(User, 'John & Johnson@#$')).resolves.toEqual('john-johnson-2');
  });

  afterAll(async (done) => {
    await User.deleteMany({ slug: { $in: ['john', 'john-johnson', 'john-johnson-1'] } });
    await mongoose.disconnect();

    done();
  });
});
