import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheProvider } from './interfaces/cache-provider.interface';

/**
 * Logica para administar la cache 
 */
@Injectable()
export class CacheProvider implements ICacheProvider {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) { }

    /**
     * get
     * @description Obtiene la Cache
     * @param key LLave del registro
     * @returns T | undefined
     */
    async get<T>(key: string): Promise<T | undefined> {
        return this.cache.get<T>(key);
    }

    /**
     * set
     * @description Guarda en cache
     * @param key LLave del registro
     * @param value Objeto del registro
     * @param ttl Tiempo de durabilidad
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this.cache.set(key, value, ttl);
    }

    /**
     * del
     * @description Elimina registro de la cache
     * @param key LLave del registro
     */
    async del(key: string): Promise<void> {
        await this.cache.del(key);
    }
}