/**
 * Función para eliminar acentos y caracteres especiales de una cadena.
 */
export const normalizeText = (value: string): string =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
