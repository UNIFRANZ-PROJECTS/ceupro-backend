import { CategoryEntity, SeasonEntity, TypeProjectEntity } from "..";

export class ProjectEntity {
  constructor(
    public id: number,
    public title: number,
    public code: number,
    public category?: CategoryEntity,
    public typeProject?: TypeProjectEntity,
    public season?: SeasonEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, title, code, category, typeProject, season } = object;

    const categoryEntity = CategoryEntity.fromObject(category);
    const typeProjectEntity = TypeProjectEntity.fromObject(typeProject);
    const seasonEntity = SeasonEntity.fromObject(season);

    return new ProjectEntity(id, title, code, categoryEntity, typeProjectEntity, seasonEntity);
  }
}