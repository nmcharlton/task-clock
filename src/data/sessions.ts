// import { DataStore } from '@aws-amplify/datastore';
import { Session } from '../models';

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
  start: '10:02:33+00:00',
}];

export const getSessions = async () : Promise<Session[]> => {
  return Promise.resolve(sessions as Session[]);
  // return DataStore.query(Session);
};

export const startSession = async (task? : string) : Promise<Session> => {

  sessions.forEach((s) => {
    if (!s.end) {
      endSession(s);
    }
  });

  const [date, time] = new Date().toISOString().split('T');
  const newSession = {
    id: (Number(sessions[sessions.length-1].id)+1).toString(),
    date,
    start: time,
    task
  };

  sessions.push(newSession);
  return Promise.resolve(newSession);

  // return DataStore.save(
  //   new Session({
  //     date,
	// 	  start: time,
	// 	  task
	//   })
  // );
};

export const endSession = async (session : Session) : Promise<Session> => {
  const [_, time] = new Date().toISOString().split('T');

  const index = sessions.findIndex(s => s.id === session.id);
  sessions[index] = {...sessions[index], end: time};
  return Promise.resolve(sessions[index]);

  // return DataStore.save(
  //   Session.copyOf(session, updated => {
  //     updated.end = time;
  //   })
  // );
};
