import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/api/member/model/member.entity';
import { Repository } from 'typeorm';
import { IAlertResponse, IFormattedAlerts } from '../interface/alert.interface';
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
    const alerts: IAlertResponse = await this.getAlertsByMemberId(memberId);
    const alertCount: number =
      alerts.completedAnswers.length + alerts.questionRequests.length;

    return {
      questionRequests: alerts.questionRequests,
      completedAnswers: alerts.completedAnswers,
      alertCount: alertCount,
    };
  }

  private async getAlertsByMemberId(memberId: number): Promise<IAlertResponse> {
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

    const formattedRequestAlerts: IFormattedAlerts[] =
      this.formattingAlerts(requestAlerts);
    const formattedResponseAlerts: IFormattedAlerts[] =
      this.formattingAlerts(responseAlerts);

    return {
      questionRequests: formattedRequestAlerts,
      completedAnswers: formattedResponseAlerts,
    };
  }

  private formattingAlerts(alerts: AlertEntity[]): IFormattedAlerts[] {
    const formattedAlerts: IFormattedAlerts[] = [];

    alerts.map((alert: AlertEntity) =>
      formattedAlerts.push({
        friendId: alert.friend.id,
        questionnaireId: alert.questionnaireList.id,
        createdAt: alert.createdAt,
      }),
    );

    return formattedAlerts;
  }
}
