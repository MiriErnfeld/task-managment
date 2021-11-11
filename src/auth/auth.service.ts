import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { AuthCredentialsDto } from './dto/auth-cridantiols.dto';
import { UserRepository } from './user.repository'


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService : JwtService,
    ) { }
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        console.log("in service");

        return this.userRepository.signup(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) :Promise<{accessToken:string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto)
        if(!username){
            throw new UnauthorizedException('invalid credantiols')
        }
         

        const payload:JwtPayload={username}
        const accessToken=await this.jwtService.sign(payload)
        return {accessToken}
    }
}
