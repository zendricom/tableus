import { ReactElement, ReactFragment } from "react";

// maybe react node?
// or Return<ReactNode>
export type ValidJSX =
  | JSX.Element
  | ReactElement
  | string
  | null
  | number
  | ReactFragment;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;
