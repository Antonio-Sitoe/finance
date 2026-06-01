import { Pipe, PipeTransform } from '@angular/core'
import { PROFILE_ROLE, SITUATION_LABEL } from '../interfaces/enum.dto'

@Pipe({
  name: 'situation',
})
export class SituationPipe implements PipeTransform {
  transform(situation: string): unknown {
    return (
      SITUATION_LABEL[situation as keyof typeof SITUATION_LABEL] || situation
    )
  }
}
