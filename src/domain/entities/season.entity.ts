import { StageEntity } from "..";

export class SeasonEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public start: Date,
    public end: Date,
    public stages?: StageEntity[],
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, price,start, end, stages } = object;
    return new SeasonEntity(id, name,price, start, end, stages.map((e: StageEntity) => StageEntity.fromObject(e)));
  }
}
