import {repository} from '@loopback/repository';
import {
  HttpErrors,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {authorize} from 'loopback4-authorization';
import {Role} from '../enum';
import {sellerPermissions, buyerPermissions} from '../enum/permission.enum';
import {UserAuthDto, UserCredentials} from '../models';
import {UserCredentialsRepository, UserRepository} from '../repositories';
import * as crypto from 'crypto';

export class LoginController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
  ) {}

  @authorize({permissions: ['*']})
  @post('/login')
  @response(200, {
    description: 'UserAuthDto model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserAuthDto)}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserAuthDto, {
            title: 'NewUserAuthDto',
          }),
        },
      },
    })
    userAuthDto: Omit<UserAuthDto, 'id'>,
  ): Promise<{token: string}> {
    const userCreds = await this.userCredentialsRepository.findOne({
      where: {email: userAuthDto.email},
    });
    if (!userCreds) {
      throw HttpErrors.NotFound();
    }

    if(!this.validatePassword(userAuthDto.password, userCreds)){
      throw new HttpErrors.Unauthorized();
    }

    const user = await this.userRepository.findOne({where:{email:userAuthDto.email}})

    const jwtPayload = {
      ...user?.toJSON(),
      permissions:
        user?.role === Role.SELLER ? sellerPermissions : buyerPermissions,
    };

    const token = jwt.sign(jwtPayload, 'secret', {
      expiresIn: '2h',
    });
    return {token};
  }

   validatePassword(password:string, userCreds:UserCredentials){

    var hash = crypto.pbkdf2Sync(password,  
    userCreds.salt, 1000, 64, `sha512`).toString(`hex`); 
    return userCreds.password === hash; 
  }
}
