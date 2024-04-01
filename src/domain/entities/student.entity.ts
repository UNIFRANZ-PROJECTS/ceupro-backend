import { UserEntity } from "..";

export class StudentEntity {
  constructor(
    public id: number,
    public code: string,
    public user: UserEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, code, user } = object;
    return new StudentEntity(id, code, UserEntity.fromObject(user));
  }
}
