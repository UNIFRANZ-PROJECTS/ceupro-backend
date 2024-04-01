import { UserEntity } from "..";

export class TeacherEntity {
  constructor(
    public id: number,
    public ci: string,
    public user: UserEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, ci, user } = object;
    return new TeacherEntity(id, ci, UserEntity.fromObject(user));
  }
}
