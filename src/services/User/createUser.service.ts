import { User } from '@prisma/client';
import { prisma } from '../../../prisma/client/client';
import bycrpt from 'bcrypt';
import { randomUUID } from 'crypto';
import { IUserRequest } from '../../interfaces/user/user';
import { AppError } from '../../errors/AppError';

const createUserService = async ({
  email,
  password,
}: IUserRequest): Promise<User> => {
  if (email !== 'angela@gmail.com') {
    throw new AppError(400, 'You are not admin');
  }

  const user = await prisma.user.create({
    include: {
      books: true,
    },
    data: {
      id: randomUUID(),
      email,
      password: await bycrpt.hash(password, 8),
    },
  });

  return { ...user, password: '' };
};

export default createUserService;
