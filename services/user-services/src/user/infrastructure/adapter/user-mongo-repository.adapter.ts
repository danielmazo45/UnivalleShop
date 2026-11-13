import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/port/repositories/user.repository.js';
import { UserDocument, UserHydratedDocument } from '../schemas/user.schema.js';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UserMongoRepositoryAdapter implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserHydratedDocument>,
  ) {}

  async SaveUser(user: User): Promise<User> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(user.password, salt, 64)) as Buffer;
    const storedPassword = `scrypt:${salt}:${hash.toString('hex')}`;

    const created = await this.userModel.create({
      name: user.name,
      email: user.email,
      password: storedPassword,
    });

    // No devolvemos el hash a la capa de aplicación.
    return new User(
      created.name,
      created.email,
      '',
      created._id.toString(),
      created.createdAt,
    );
  }
}
