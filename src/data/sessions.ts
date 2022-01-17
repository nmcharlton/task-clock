import { DataStore } from '@aws-amplify/datastore';
import { DateTime } from 'luxon';
import { Session } from '../models';

const dataStore = true;

let sessions: Session[] = [{
  id: '1',
  task: 'Test',
  date: '2022-01-15',
  start: '09:00:00+00:00',
  end: '09:30:23+00:00',
},{
  id: '2',
  task: 'Test',
  date: '2022-01-15',
  start: '09:45:00+00:00',
  end: '10:02:35+00:00',
},{
  id: '3',
  task: 'Check',
  date: '2022-01-15',
  start: '10:02:33+00:00',
  end: '10:06:35+00:00',
},{
  id: '4',
  task: 'Check',
  date: '2022-01-15',
  start: '10:07:33+00:00',
}];

export const getSessions = async (date: string = DateTime.now().toISODate()) : Promise<Session[]> => {
  if (dataStore) {
    return DataStore.query(Session, s => s.date('eq', date));
  } else {
    return Promise.resolve(sessions as Session[]);
  }
};

export const startSession = async (task? : string) : Promise<Session> => {

  const liveSessions = await DataStore.query(Session, s => s.end('notContains', ':'));
  liveSessions.forEach((s) => {
    if (!s.end) {
      endSession(s);
    }
  });

  const now = DateTime.now();
  const date = now.toISODate();
  const start = now.toISOTime();
  const newSession = {
    id: now.valueOf().toString(),
    date,
    start,
    task
  };

  if (dataStore) {
    return DataStore.save(
      new Session({
        date,
    	  start,
    	  task
      })
    );
  } else {
    sessions.push(newSession);
    return Promise.resolve(newSession);
  }
};

export const endSession = async (session : Session) : Promise<Session> => {
  const end = DateTime.now().toISOTime();

  if (dataStore) {
    return DataStore.save(
      Session.copyOf(session, updated => {
        updated.end = end;
      })
    );
  } else {
    const index = sessions.findIndex(s => s.id === session.id);
    sessions[index] = {...sessions[index], end};
    return Promise.resolve(sessions[index]);
  }
};
