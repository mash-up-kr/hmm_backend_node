import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/api/member/model/member.entity';
import { Repository } from 'typeorm';
import { idText } from 'typescript';
import {
  IAlertExistResponse,
  IAlertResponse,
  IFormattedAlerts,
} from '../interface/alert.interface';
import { AlertEntity } from '../model/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertEntityRepository: Repository<AlertEntity>,

    @InjectRepository(Member)
    private readonly memberepository: Repository<Member>,
  ) {}

  async getAlerts(memberId: number): Promise<IAlertResponse> {
    const alerts: IFormattedAlerts[] = await this.getAlertsByMemberId(memberId);
    const alertCount: number = alerts.length;

    return {
      alerts: alerts,
      alertCount: alertCount,
    };
  }

  async doesMemberHaveAlert(memberId: number): Promise<IAlertExistResponse> {
    const member: Member = await this.memberepository.findOneByOrFail({
      id: memberId,
    });
    const alert: AlertEntity | null = await this.alertEntityRepository.findOne({
      where: { member: member },
    });

    if (alert) {
      return { alertExistence: true };
    }
    return { alertExistence: false };
  }

  private async getAlertsByMemberId(
    memberId: number,
  ): Promise<IFormattedAlerts[]> {
    const member: Member = await this.memberepository.findOneByOrFail({
      id: memberId,
    });

    const requestAlerts: AlertEntity[] = await this.alertEntityRepository.find({
      where: { member: member, isRequestAlert: true },
      relations: { friend: true, questionnaireList: true },
      order: { createdAt: 'DESC' },
    });

    const responseAlerts: AlertEntity[] = await this.alertEntityRepository.find(
      {
        where: { member: member, isRequestAlert: false },
        relations: { friend: true, questionnaireList: true },
        order: { createdAt: 'DESC' },
      },
    );

    const formattedAlerts: IFormattedAlerts[] = this.formattingAlerts(
      requestAlerts.concat(responseAlerts),
    );

    return formattedAlerts;
  }

  private formattingAlerts(alerts: AlertEntity[]): IFormattedAlerts[] {
    const formattedAlerts: IFormattedAlerts[] = [];

    alerts.map((alert: AlertEntity) => {
      if (alert.isRequestAlert) {
        formattedAlerts.push({
          friendId: alert.friend.id,
          questionnaireId: alert.questionnaireList.id,
          createdAt: alert.createdAt,
          type: 'questionRequests',
        });
      } else {
        formattedAlerts.push({
          friendId: alert.friend.id,
          questionnaireId: alert.questionnaireList.id,
          createdAt: alert.createdAt,
          type: 'completedAnswers',
        });
      }
    });

    return formattedAlerts;
  }
}
