
import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async login(
    username: string,
    password: string
  ) {
    const adminUsername =
      process.env.ADMIN_USERNAME || "admin";

    const adminPassword =
      process.env.ADMIN_PASSWORD || "admin123";

    const passwordMatches =
      await bcrypt.compare(
        password,
        await bcrypt.hash(adminPassword, 10)
      );

    if (
      username !== adminUsername ||
      !passwordMatches
    ) {
      throw new UnauthorizedException(
        "Invalid username or password"
      );
    }

    const payload = {
      username: adminUsername,
      role: "admin",
    };

    return {
      access_token:
        this.jwtService.sign(payload),
    };
  }
}

