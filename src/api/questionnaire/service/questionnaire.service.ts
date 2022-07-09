import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaireList.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaireDetail.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntity: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntity: Repository<QuestionnaireDetailEntity>,
  ) {}

  async findAllList() {
    return await this.listEntity.find();
  }

  async findAllDetail() {
    return await this.detailEntity.find();
  }
}
