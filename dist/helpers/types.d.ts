import { ReactElement } from "react";
export declare type ValidJSX = JSX.Element | ReactElement | null;
declare type PathImpl<T, K extends keyof T> = K extends string ? T[K] extends Record<string, any> ? T[K] extends ArrayLike<any> ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}` : K | `${K}.${PathImpl<T[K], keyof T[K]>}` : K : never;
export declare type Path<T> = PathImpl<T, keyof T> | keyof T;
export {};
//# sourceMappingURL=types.d.ts.map