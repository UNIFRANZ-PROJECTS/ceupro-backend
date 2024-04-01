export class ProjectDto {

  private constructor(
    public readonly title: string,
    public readonly categoryId: number,
    public readonly typeProjectId: number,
    public readonly staffId: number,
    public readonly seasonId: number,
  ) { }

  static body(object: { [key: string]: any }): [string?, ProjectDto?] {

    const { title, categoryId, typeProjectId, staffId, seasonId } = object;

    if (!title) return ['El titulo es obligatorio'];
    if (!categoryId) return ['El id del la categoria es obligatoria'];
    if (!typeProjectId) return ['El id del tipo de proyecto es obligatoria'];
    if (!staffId) return ['El id del staff es obligatorio'];
    if (!seasonId) return ['El id de la temporada es obligatoria'];

    return [undefined, new ProjectDto(title, categoryId, typeProjectId, staffId, seasonId)];
  }
}