import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IReverseGeo } from '../models/interfaces/reverse-geo.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenweatherGeoApiService {
  baseUrl: string = 'http://api.openweathermap.org/geo/1.0/';

  constructor(private _http: HttpClient) { }

  getReverseGeocoding(lat: number, lon: number, limit: number): Observable<IReverseGeo[]> {
    const apiKey: string = environment.owApiKey;
    const url: string = `${this.baseUrl}/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;
    return this._http.get<IReverseGeo[]>(url);
  }
}
