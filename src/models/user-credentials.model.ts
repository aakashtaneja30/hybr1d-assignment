import { uuid } from '@loopback/core';
import {Entity, model, property} from '@loopback/repository';

@model({name:"user_credentials_1"})
export class UserCredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  salt: string;


  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

