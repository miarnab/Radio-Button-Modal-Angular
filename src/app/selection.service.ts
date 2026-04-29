import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  // Default test endpoint (JSONPlaceholder). Replace with your real API.
  private endpoint = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  saveSelection(selection: string | null): Observable<any> {
    const payload = { selection };
    return this.http.post(this.endpoint, payload).pipe(
      catchError((err) => {
        console.error('Save selection failed', err);
        return of({ error: true, details: err });
      })
    );
  }
}
