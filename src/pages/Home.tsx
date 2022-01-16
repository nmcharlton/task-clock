import SessionListItem from '../components/SessionListItem';
import { useState } from 'react';
import { Session } from '../models';
import { getSessions, startSession, endSession } from '../data/sessions';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import { DateTime } from 'luxon';

const Home: React.FC = () => {

  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<Session[][]>([]);
  const [now, setNow] = useState<DateTime>(DateTime.now());
  const [newTaskName, setNewTaskName] = useState<string>('');

  useIonViewWillEnter(() => {
    refreshSessions();
    setInterval(() => {
      setNow(DateTime.now());
    }, 1000);
  });

  const refresh = (e: CustomEvent) => {
    refreshSessions().then(() => {
      e.detail.complete();
    });
  };

  const updateGroups = () => {
    const tasks = sessions.reduce((output: string[], s) => {
      if (s?.task && output.indexOf(s.task) === -1) {
        output.push(s.task);
      }
      return output;
    }, []);

    setGroups(Object.values(sessions.reduce((output: Session[][], s) => {
      const index = tasks.indexOf(s.task as any);
      if (index >= 0) {
        output[index].push(s);
      }
      return output;
    }, tasks.map(() => []))));
  }

  const refreshSessions = () : Promise<void> => {
    return getSessions().then((data) => {
      setSessions(data.sort((a: Session, b: Session)=> {
        if (!a.end) return -1;
        if (!b.end) return 1;
        if (a.end > b.end) return -1;
        return 1;
      }));

      updateGroups();
    });
  }

  const handleSessionClick = (session: Session) => {
    let fn = Promise.resolve();
    if (session.end) {
      startSession(session.task);
    } else {
      endSession(session);
    }

    fn.then(() => {
      refreshSessions();
    })
  }

  const handleStartNewTask = () => {
    startSession(newTaskName).then(() => refreshSessions());
    setNewTaskName('');
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Inbox
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <form onSubmit={(e) => {e.preventDefault(); handleStartNewTask(); return false;}}>
            <IonItem>
              <IonInput value={newTaskName} slot='start' type='text' onIonInput={(e: any) => setNewTaskName(e.target.value)}/>
              <IonButton type='submit' slot='end' disabled={!newTaskName}>
                Start New Task
              </IonButton>
            </IonItem>
          </form>
          {groups.map(g => <SessionListItem key={g[0].task} sessions={g} now={now} onClick={() => handleSessionClick(g[0])} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
