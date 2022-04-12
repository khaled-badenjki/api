import * as mongoose from 'mongoose';
const expect = require('chai').expect;
import User from '@models/User';
import { generateSlug } from '@utils/slugify';

// eslint-disable-next-line
require('dotenv-flow').config();

describe('slugify', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URL);

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
  });

  it('not duplicated', async () => {
    expect(await generateSlug(User, 'John J Johnson@#$')).to.be.equal('john-j-johnson');
  });

  it('one time duplicated', async () => {
    expect(await generateSlug(User, ' John@#$')).to.be.equal('john-1');
  });

  it('multiple duplicated', async () => {
    expect(await generateSlug(User, 'John & Johnson@#$')).to.be.equal('john-johnson-2');
  });

  after(async () => {
    await User.deleteMany({ slug: { $in: ['john', 'john-johnson', 'john-johnson-1'] } });
    await mongoose.disconnect();
  });
});
