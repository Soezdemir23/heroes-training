import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-hereos';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Sounds like a global state.
// I can't wait to research more about it after doing the tutorial.
//
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // url to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  // I wonder if the dependency injection is
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // For the observer, it "feels" to me like a Promise of the type Hero[]
  // Pretty sure this is not superimposable at all, so I should read the docs
  // while I wait for the next jobs in my current occupation.
  // This is being replaced with httpClient
  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched Heroes');
    return heroes;
  }*/
  // Adding tap() operator from RxJS so it can
  // look at the observable values, do something with those values, then pass them along.
  // Haven't really seen something like this yet in React or I wasn't aware of it.
  // When I get the idea, I should try to find hooks that act like that or utils.
  // make them myself if not found.
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /*getHero(id: number): Observable<Hero> {
    // Imagine there is always a hero with the specified id.
    // Error handling comes next chapter
    const hero = HEROES.find((h) => h.id === id)!; //<-- !Exclamation mark for it to be ignored, if there is nothing. But what about exclamation mark?
    this.messageService.add(`HeroService: fethced hero id=${id}`);
    return of(hero); //RxJs being used. there was a HTTP request library for it too in the quickstart being used.
    // I guess fetching it via promises is being obfuscated here until I dig deeper.
  }*/

  /** Rewrite this as detailed in the tutorial, the above is still standing for me to look up and continue commenting
   * GET hero by id. Will 404 if id not found
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`; //:baseurl/:id
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<unknown> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //POST method. Forgot that put is or updates and Post for new additions to a collection
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  // Delete method passed from heroes component
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero with id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  // I implemented a searchhbar through the use of a serial api call, also a single api call to ticketmaster for the shoppingcart project.
  // Never did one a long time ago with a databases, that I remember well enough
  // This is interesting how angular deals with it. It IS different than just JS/TS
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]); //if string is empty, return nothing. I set a length of zero for the react-query api call in my current project.
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      // nice, I am creating my own api query. This is getting interesting
      tap((x) =>
        x.length
          ? this.log(`found heroes mathcing "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  /**
   * Handle Http operation that fails. App continues tho.
   *
   * @param operaion - name of the oepration that failed
   * @param result - optional value to returnb as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} faled: ${error.message}`);

      // Let the app run by returning an empty result
      return of(result as T);
    };
  }
}
