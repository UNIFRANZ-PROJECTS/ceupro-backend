export class ParallelDto {

  private constructor(
    public readonly name: string,
    public readonly teacherId: number,
    public readonly subjectId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, ParallelDto?] {

    const { name, teacherId, subjectId } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!teacherId) return ['El id del profesor es obligatorio'];
    if (!subjectId) return ['El id de la materia es obligatoria'];

    return [undefined, new ParallelDto(name, teacherId, subjectId)];
  }
}