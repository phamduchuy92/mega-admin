import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as _ from 'lodash';

export const translationNotFoundMessage = 'translation-not-found';

export class MissingTranslationHandlerImpl implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    // const key = params.key;
    // return `${translationNotFoundMessage}[${key}]`;
    const translation = _.startCase(_.last(params.key.split('.')));
    return translation;
  }
}

export function translatePartialLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, 'i18n/', `.json`);
}

export function missingTranslationHandler(): MissingTranslationHandler {
  return new MissingTranslationHandlerImpl();
}
