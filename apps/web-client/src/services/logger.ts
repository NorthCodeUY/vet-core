// apps/web-client/src/services/logger.ts

/** 
 * <!> NO lo tengo claro quero que es para guardar los errores y mandarlo al bakend supongo revisar despues 
 */
export const logErrorToBackend = async (error: any, url: string) => {
  try {
    await fetch('/api/logs/frontend', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        url: url,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) {
    console.error("No pude enviar el log al backend", e);
  }
};