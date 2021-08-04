import { HttpParams } from '@angular/common/http';
import * as _ from 'lodash';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();

  if (req) {
    // Object.keys(req).forEach(key => {
    //   if (key !== 'sort') {
    //     options = options.set(key, req[key]);
    //   }
    // });

    // optimize
    _.forEach(req, (val, key) => {
      if (key !== 'sort') {
        if (_.isArray(val)) {
          _.forEach(val, v => (options = options.append(key, v)));
        } else if (_.isPlainObject(val)) {
          options = options.set(key, JSON.stringify(req[key]));
        } else {
          options = options.set(key, req[key]);
        }
      }
    });

    if (req.sort) {
      req.sort.forEach((val: string) => {
        options = options.append('sort', val);
      });
    }
  }

  return options;
};
