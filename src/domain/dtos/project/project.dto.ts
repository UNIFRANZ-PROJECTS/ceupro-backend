export class ProjectDto {

  private constructor(
    public readonly title: string,
    public readonly categoryId: number,
    public readonly typeProjectId: number,
    public readonly seasonId: number,
    public readonly students: number[],
  ) { }

  static body(object: { [key: string]: any }): [string?, ProjectDto?] {

    const { title, categoryId, typeProjectId, seasonId,students } = object;

    if (!title) return ['El titulo es obligatorio'];
    if (!categoryId) return ['El id del la categoria es obligatoria'];
    if (!typeProjectId) return ['El id del tipo de proyecto es obligatoria'];
    if (!seasonId) return ['El id de la temporada es obligatoria'];
    if (!students) return ['Es necesario incluir a los estudiantes'];
    if (students.length == 0) return ['Debe ver almenos un estudiante'];

    return [undefined, new ProjectDto(title, categoryId, typeProjectId, seasonId,students)];
  }
}