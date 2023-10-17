import { Injectable } from '@angular/core';
import { HttpClient } from
  '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private http: HttpClient) { }

  getTheme() {
    return {
      "themecoloralt": "#fff",
      "themecolor": "#1D1D35",
      "topbar": "#fff",
      "sidebar": "#000",
      "bodycolor": "#f3f4f3",
      "bodytext": "#1D1D35"
    };
  }
}

interface Theme {
  themecoloralt: string;
  themecolor: string;
  topbar: string;
  sidebar: string;
  bodycolor: string;
  bodytext: string;
}
