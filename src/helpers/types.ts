import { ReactElement } from "react";

export type ValidJSX = JSX.Element | ReactElement | null;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;