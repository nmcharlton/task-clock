import { DataStore } from '@aws-amplify/datastore';
import { Session } from '../models';

export const getSessions = async () : Promise<Session[]> => {
  return DataStore.query(Session);
};

export const startSession = async (task : string) : Promise<Session> => {
  return DataStore.save(
    new Session({
		  start_time: Date().toString(),
		  task
	  })
  );
};

export const endSession = async (session : Session) : Promise<Session> => {
  return DataStore.save(
    Session.copyOf(session, updated => {
      updated.end_time = Date().toString();
    })
  );
};
