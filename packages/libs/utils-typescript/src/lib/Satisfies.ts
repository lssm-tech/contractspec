export declare type Satisfies<ConstraintShape, ToValidate> =
  ConstraintShape extends ConstraintShape ? ToValidate : never;
