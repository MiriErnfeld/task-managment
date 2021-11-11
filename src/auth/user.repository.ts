import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { BaseEntity, EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AuthCredentialsDto } from "./dto/auth-cridantiols.dto";
import { User } from "./user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        console.log("in repository");

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        console.log(user.salt);

        user.password = await this.hushPassword(password, user.salt);
        console.log("before try!");

        try {
            await user.save();
            console.log(user);

        } catch (error) {
            console.log(error.code);//not working
            if (error.code === 23505) { //duplicatad username
                throw new ConflictException('username already exist')
            }
            else {
                console.log("in else");

                throw new InternalServerErrorException()
            }

        }


    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto
      const user=await this.findOne({username})
      if(user && await user.valitaPassword(password)) {
          return user.username
      }
      else{
          return null;
      }


    }

    private async hushPassword(password: string, salt: string): Promise<string> {
        console.log("in password function");
        const t = bcrypt.hash(password, salt)
        console.log(t);

        return t
    }

}
