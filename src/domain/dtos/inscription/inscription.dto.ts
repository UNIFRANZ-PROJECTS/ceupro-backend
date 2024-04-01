export class InscriptionDto {

  private constructor(
    public readonly total: number,
    public readonly studentId: number,
    public readonly staffId: number,
    public readonly seasonId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const { total, studentId, staffId, seasonId } = object;

    if (!total) return ['El total es obligatorio'];
    if (!studentId) return ['El id del estudiante es obligatorio'];
    if (!staffId) return ['El id del staff es obligatorio'];
    if (!seasonId) return ['El id de la temporada es obligatoria'];

    return [undefined, new InscriptionDto(total, studentId, staffId, seasonId)];
  }
}