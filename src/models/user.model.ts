import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {Role} from '../enum';
import { uuid } from '@loopback/core';

@model({
  name: 'users_1',
})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'full_name',
  })
  name: string;

  @property({
    type: 'string',
    name: 'username',
  })
  username: string;

  @property({
    type: 'string',
    name: 'email',
  })
  email: string;

  @property({
    type: 'string',
    name: 'role',
  })
  role: Role;

  permissions?: string[];

  getIdentifier?(): string | undefined;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
