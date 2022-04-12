# NgxDateTimePicker

Date time picker for Angular - [example](https://stackblitz.com/edit/components-date-time-picker).

![](/images/ngx-date-time-picker.png)

# Usage

```
<ngx-date-time-picker
  seconds
  type="date-time"
  locale="en-US"
  [value]="initValue"
  (change)="showChanges($event)"
></ngx-date-time-picker>

<ngx-date-time-picker
  seconds
  type="date"
  locale="pl-PL"
  [value]="initValue"
  (change)="showChanges($event)"
></ngx-date-time-picker>

<ngx-date-time-picker
  type="time"
  (change)="showChanges($event)"
></ngx-date-time-picker>
```

If you do not specify a locale your browser settings will be used. If there are no [settings](https://github.com/maciej-tokarz/ngx-components/blob/master/projects/ngx-date-time-picker/src/lib/settings-data.ts) for your country, please send them to [us](mailto:maciej.tokarz@my-poi.pl) and they will be completed.

If you want to co-create a solution [speak](mailto:maciej.tokarz@my-poi.pl) up.
