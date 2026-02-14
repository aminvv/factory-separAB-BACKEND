import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }




// ===================== CREATE ====================================
  async create(dto: CreateUserDto) {

    const exists = await this.userRepository.findOne({
      where: { mobile: dto.mobile },
    });

    if (exists) {
      throw new ConflictException("Mobile already exists");
    }

    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }





// ===================== FIND ALL ====================================
  async findAll() {
    return this.userRepository.find({
      order: { id: "DESC" },
      relations: ["addresses"], // اگر خواستی ریلیشن لود بشه
    });
  }



  // ===================== FIND ONE ====================================
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["addresses"],
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }






  // ===================== UPDATE ====================================
  async update(id: number, dto: UpdateUserDto) {

    const user = await this.findOne(id);

    if (dto.mobile) {
      const exists = await this.userRepository.findOne({
        where: { mobile: dto.mobile },
      });

      if (exists && exists.id !== id) {
        throw new ConflictException("Mobile already exists");
      }
    }

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }







  // ===================== REMOVE ====================================
  async remove(id: number) {

    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return { message: "User removed successfully" };
  }
}
