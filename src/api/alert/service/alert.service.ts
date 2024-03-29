import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/api/member/model/member.entity';
import { Repository } from 'typeorm';
import {
  IAlertExistResponse,
  IAlertResponse,
  IFormattedAlert,
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
    const alerts: IFormattedAlert[] = await this.getAlertsByMemberId(memberId);
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
  ): Promise<IFormattedAlert[]> {
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

    const formattedAlerts: IFormattedAlert[] = this.formattingAlerts(
      requestAlerts.concat(responseAlerts),
    );

    return formattedAlerts;
  }

  private formattingAlerts(alerts: AlertEntity[]): IFormattedAlert[] {
    const formattedAlerts: IFormattedAlert[] = [];

    alerts.map((alert: AlertEntity) => {
      if (alert.isRequestAlert) {
        formattedAlerts.push({
          friend: {
            id: alert.friend.id,
            name: alert.friend.name,
            thumbnailImageUrl: alert.friend.thumbnailImageUrl,
          },
          questionnaireId: alert.questionnaireList.id,
          createdAt: alert.createdAt.getTime(),
          type: 'questionRequests',
        });
      } else {
        formattedAlerts.push({
          friend: {
            id: alert.friend.id,
            name: alert.friend.name,
            thumbnailImageUrl: alert.friend.thumbnailImageUrl,
          },
          questionnaireId: alert.questionnaireList.id,
          createdAt: alert.createdAt.getTime(),
          type: 'completedAnswers',
        });
      }
    });

    return formattedAlerts;
  }
}
