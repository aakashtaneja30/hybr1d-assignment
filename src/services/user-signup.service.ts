import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { UserCredentialsRepository, UserRepository } from '../repositories';
import {  UserSignupDto } from '../models';
import { HttpErrors } from '@loopback/rest';
import * as crypto from 'crypto';

@injectable({scope: BindingScope.TRANSIENT})
export class UserSignupService {
  constructor( @repository(UserRepository)
  public userRepository : UserRepository,
  @repository(UserCredentialsRepository)
  public userCredentialsRepository : UserCredentialsRepository,
  ) {}


  async signupUser(userSignupDto:UserSignupDto){

    const password= userSignupDto.password;


    if( (await this.userRepository.find({where:{email:userSignupDto.email}})).length){
      throw HttpErrors.BadRequest("Email Id not Available")
    }

   const  user= await this.userRepository.create({username:userSignupDto.username, email:userSignupDto.email, role: userSignupDto.role, name: userSignupDto.name});
    await this.setUserCreds(user.email, password);
    return user;

  }

  async setUserCreds(email:string, providedPassword:string){
    let salt  = crypto.randomBytes(16).toString('hex'); 
    let password=crypto.pbkdf2Sync(providedPassword, salt,  
      1000, 64, `sha512`).toString(`hex`);

     await this.userCredentialsRepository.create({email,password,salt})
  }
}
