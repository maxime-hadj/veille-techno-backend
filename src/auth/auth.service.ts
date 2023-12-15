import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signupDto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(signupDto: SignupDto) {
    const {email, password, username} = signupDto;
    const user = await this.prismaService.user.findUnique({where : {email}});
    if(user) throw new ConflictException("This user already exists.");
    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.create({
      data : { email, username, password: hash },
    })
    return { data : 'The user was successfully created !' };
  }
}
