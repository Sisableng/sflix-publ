export type Override<Type, NewType> = Omit<Type, keyof NewType> & NewType;

export type Cover = {
  src: string;
  placeholder: string;
};
