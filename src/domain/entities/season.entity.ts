import { StageEntity } from "..";

export class SeasonEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public start: Date,
    public end: Date,
    public stages?: StageEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, price,start, end, stages } = object;

    const stageEntity = stages ? StageEntity.fromObject(stages) : undefined;

    return new SeasonEntity(id, name,price, start, end, stageEntity);
  }
}
