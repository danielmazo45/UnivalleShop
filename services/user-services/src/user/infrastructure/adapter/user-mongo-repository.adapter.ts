import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
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

    return new User(
      created.name,
      created.email,
      '',
      created._id.toString(),
      created.createdAt,
    );
  }

  async AuthenticateUser(email: string, password: string): Promise<User | null> {
    // select: false en el esquema: solo solicitamos el hash para verificar credenciales.
    const record = await this.userModel.findOne({ email }).select('+password').exec();
    if (!record || typeof record.password !== 'string') return null;
    const fields = record.password.split(':');
    if (fields.length !== 3 || fields[0] !== 'scrypt' ||
        !/^[0-9a-f]{32}$/.test(fields[1]) || !/^[0-9a-f]{128}$/.test(fields[2])) {
      return null;
    }
    const actual = (await scrypt(password, fields[1], 64)) as Buffer;
    const expected = Buffer.from(fields[2], 'hex');
    if (!timingSafeEqual(actual, expected)) return null;
    // No devolvemos ni la contraseña ni su hash.
    return new User(record.name, record.email, '', record._id.toString(), record.createdAt);
  }
}
