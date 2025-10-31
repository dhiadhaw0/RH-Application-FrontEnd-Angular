import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private loadingMap = new Map<string, boolean>();

  constructor() {}

  setLoading(loading: boolean, url?: string): void {
    if (url) {
      this.loadingMap.set(url, loading);
      const anyLoading = Array.from(this.loadingMap.values()).some(isLoading => isLoading);
      this.loadingSubject.next(anyLoading);
    } else {
      this.loadingSubject.next(loading);
    }
  }

  getLoading(): boolean {
    return this.loadingSubject.value;
  }

  showLoader(): void {
    this.setLoading(true);
  }

  hideLoader(): void {
    this.setLoading(false);
  }

  isLoading(): Observable<boolean> {
    return this.loading$;
  }
}
