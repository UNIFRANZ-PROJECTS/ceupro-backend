export class InscriptionDto {

  private constructor(
    public readonly total: number,
    public readonly amountDelivered: number,
    public readonly studentId: number,
    public readonly seasonId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const { total,amountDelivered, studentId, seasonId } = object;

    if (!total) return ['El total es obligatorio'];
    if (!amountDelivered) return ['El monto entregado es obligatorio'];
    if (!studentId) return ['El id del estudiante es obligatorio'];
    if (!seasonId) return ['El id de la temporada es obligatoria'];

    return [undefined, new InscriptionDto(total, amountDelivered, studentId, seasonId)];
  }
}