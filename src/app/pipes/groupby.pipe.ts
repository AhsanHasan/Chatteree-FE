import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
    transform(collection: any[], property: string): any[] {
        if (!collection || !property) {
            return collection;
        }

        const groupedCollection = collection.reduce((acc, obj) => {
            const key = obj[property];
            acc[key] = acc[key] || [];
            acc[key].push(obj);
            return acc;
        }, {});

        return Object.values(groupedCollection);
    }
}