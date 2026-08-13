import { Injectable } from '@nestjs/common';

@Injectable()
export class LabelsService {
  getLabels(): string[] {
    return ['Bug', 'Feature', 'Enhancement', 'Documentation', 'Design'];
  }
}
