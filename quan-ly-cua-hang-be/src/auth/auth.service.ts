import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { catchError, map, switchMap, throwError } from "rxjs";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { RegisterDTO } from "./dto/register.dto";
import { User } from "./interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly sql: SqlConnectService,
    private jwt: JwtService,
  ) {}

  async login(data: User) {
    // jwt
    const payload = { id: data.id, email: data.email };
    const access_token = await this.jwt.signAsync(payload);
    return {
      status: "success",
      message: "Login successful",
      access_token,
    };
  }

  register(dto: RegisterDTO) {
    // hash password
    const hash = bcrypt.hashSync(dto.password, 12);
    dto.password = hash;
    const sqlInsertProfile = this.sql.readFileSQL("profile/insert-profile.sql");
    const paramsProfile = [dto.firstname, dto.lastname, dto.phone, dto.address];
    let pid;
    return this.sql.query1(sqlInsertProfile, paramsProfile).pipe(
      map((res) => res.rows[0].id),
      switchMap((profile_id) => {
        pid = profile_id;
        const sqlInsertUser = this.sql.readFileSQL("user/insertUser.sql");
        const paramsUser = [dto.email, dto.password, profile_id];
        return this.sql.query1(sqlInsertUser, paramsUser).pipe(
          map((res) => res.rows[0].id),
          switchMap((id_user) => {
            const sqlInserUser_Role = this.sql.readFileSQL(
              "user_role/insertUser_Role.sql",
            );
            const paramsUser_Role = [id_user, 1];
            return this.sql.query1(sqlInserUser_Role, paramsUser_Role);
          }),
          map(() => {
            return {
              status: "success",
              message: "register successfully",
            };
          }),
        );
      }),
      catchError((error) => {
        if (error.code === "23505") {
          const sqlDeleteProfile = this.sql.readFileSQL(
            "profile/delete-profile.sql",
          );
          this.sql.query1(sqlDeleteProfile, [pid]);
          throw new ConflictException("Email already exits");
        }
        return throwError(() => new Error(error));
      }),
    );
  }

  async findUserByEmail(email: string) {
    const res = await this.sql.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (res.rowCount === 1) {
      const user = res.rows[0];
      return user;
    }
    return null;
  }

  async authentication(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user) {
      // validated password
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) return user;
    }
    return null;
  }
}
