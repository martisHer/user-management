import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../interfaces';

@Pipe({
  name: 'groupMappingPipe'
})

export class GroupMappingPipe implements PipeTransform {
  transform(id: number [], groups: Group []): string [] | undefined {
    let groupName: string [] = [];
    id.forEach(element => {
        const group = groups.find(gi => gi.id === element);
        if (group?.name) groupName.push(group.name);
    });

    return groupName;
  }
}