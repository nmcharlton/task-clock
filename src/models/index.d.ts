import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Session {
  readonly id: string;
  readonly task?: string;
  readonly date?: string;
  readonly start?: string;
  readonly end?: string;
  constructor(init: ModelInit<Session>);
  static copyOf(source: Session, mutator: (draft: MutableModel<Session>) => MutableModel<Session> | void): Session;
}