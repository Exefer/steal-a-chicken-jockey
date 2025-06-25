export type ChangedCallbacks<T> = Array<(key: string, newData: T, oldData?: T) => void>;
