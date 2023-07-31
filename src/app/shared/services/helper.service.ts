import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private http: HttpClient,
  ) { }

  getHttpParams(paramMap: ParamMap, paramsNames: string[]): HttpParams {
    let params = new HttpParams();
    paramsNames.forEach(paramName => {
      if(paramMap.has(paramName)) {
        params = params.append(paramName, paramMap.get(paramName)!);
      }
    });
    return params;
  }
}
