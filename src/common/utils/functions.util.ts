 export const createSlug=(str:string)=>{
     return str?.replace(/[\s]+/g,'-')?.replace(/[؟<>ءٔ‌ٰ؛:«»ةًٌٍَُِّْ!٬٫٬!٬٫ْ٫،)()]+/g,'-')
 }


 export const RandomId =()=>{
    return Math.random().toString(36).substring(2)
 }