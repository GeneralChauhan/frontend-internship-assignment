import { Injectable } from '@angular/core';
import { SearchResponse } from '../models/book-response.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  CACHE_KEY_PREFIX = 'fyle-book';
  CACHE_EXPIRATION_TIME = 3600000; // 1 minute

  getCacheKey(query: string, page: number): string {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:${query}:${page}`;
    return cacheKey;
  }

  getFromCache(query: string, page: number): SearchResponse | null {
    const cacheKey = this.getCacheKey(query, page);
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData: {response: SearchResponse, expirationTime: number} = JSON.parse(cachedData);
      const expirationTime = parsedData.expirationTime;
      const currentTime = Date.now();
      if (currentTime < expirationTime) {
        return parsedData.response;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  addToCache(query: string, page: number, response: SearchResponse) {
    const cacheKey = this.getCacheKey(query, page);
    const expirationTime = Date.now() + this.CACHE_EXPIRATION_TIME;
    const dataToCache = { response, expirationTime };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  }
  

}
