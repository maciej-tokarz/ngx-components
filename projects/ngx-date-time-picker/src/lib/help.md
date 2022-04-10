ng new ngx-components --create-application=false
ng generate library ngx-date-time-picker
ng build ngx-date-time-picker --configuration development
ng test ngx-date-time-picker
ng lint ngx-date-time-picker

npm set init.author.name "Maciej Tokarz"
npm set init.author.email "maciej.tokarz@my-poi.pl"
npm set init.author.url "https://my-poi.pl"

ng build ngx-date-time-picker --prod
cd dist/ngx-date-time-picker
npm init --scope "@my-poi"
npm publish
