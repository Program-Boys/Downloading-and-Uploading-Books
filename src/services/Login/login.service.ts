import { PrismaClient, User } from '@prisma/client';
import { ILoginRequest } from '../../interfaces/login/login';
import { AppError } from '../../errors/AppError';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginService = async ({ email, password }: ILoginRequest) => {
  const prisma = new PrismaClient();

  const searchUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const passwordMatch = await compare(password, searchUser?.password!);

  if (!passwordMatch) {
    throw new AppError(403, 'Wrong email/password');
  }

  const token = jwt.sign(
    {
      email: searchUser?.email,
    },
    process.env.SECRET_KEY as string,
    {
      expiresIn: '24h',
    },
  );

  return token;
};

export default loginService;
