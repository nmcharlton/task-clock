import SessionListItem from '../components/SessionListItem';
import { useEffect, useState } from 'react';
import { Session } from '../models';
import { getSessions, startSession, endSession } from '../data/sessions';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  useIonViewDidEnter,
} from '@ionic/react';
import './Home.css';
import { DateTime } from 'luxon';

const Home: React.FC = () => {

  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<Session[][]>([]);
  const [now, setNow] = useState<DateTime>(DateTime.now());
  const [date, setDate] = useState<DateTime>(DateTime.now());
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [taskShortcuts, setTaskShortcuts] = useState<string[]>([]);

  useEffect(() => {
    const tasks = sessions.reduce((output: string[], s: Session) => {
      if (s?.task && output.indexOf(s.task) === -1) {
        output.push(s.task);
      }
      return output;
    }, []);

    setGroups(Object.values(sessions.reduce((output: Session[][], s: Session) => {
      const index = tasks.indexOf(s.task as any);
      if (index >= 0) {
        output[index].push(s);
      }
      return output;
    }, tasks.map(() => []))));
  }, [sessions])

  useEffect(() => {
    refreshSessions();
  }, [date]);
 
  useIonViewWillEnter(() => {
    refreshSessions();
    setInterval(() => {
      setNow(DateTime.now());
    }, 1000);
  });

  useIonViewDidEnter(() => {
    populateTaskShortcuts();
  });

  const refresh = async (e: CustomEvent) => {
    await refreshSessions();
    e.detail.complete();
  };

  const refreshSessions = async () : Promise<void> => {
    const data: Session[] = await getSessions(date.toISODate());
    setSessions(data.sort((a: Session, b: Session)=> {
      if (!a.end) return -1;
      if (!b.end) return 1;
      if (a.end > b.end) return -1;
      return 1;
    }));
  };

  const populateTaskShortcuts = async () => {
    // Get all tasks for the last 7 days
    const promises: Promise<Session[]>[] = [1, 2, 3, 4, 5, 6, 7].map((count) => {
      return getSessions(DateTime.now().minus({days: count}).toISODate());
    });

    const tasks: string[] = (await Promise.all(promises)).flat().reduce((output: string[], session: Session) => {
      if (session.task && !output.includes(session.task)) {
        return [...output, session.task];
      }
      return output;
    }, []).sort();

    setTaskShortcuts(tasks);
  };

  const handleSessionClick = async (session: Session) => {
    if (session.end) {
      await startSession(session.task);
    } else {
      await endSession(session);
    }
    setDate(DateTime.now());
    refreshSessions();
  }

  const handleTaskClick = async (task: string) => {
    await startSession(task);
    setDate(DateTime.now());
    refreshSessions();
  }

  const handleStartNewTask = async () => {
    setNewTaskName('');
    await startSession(newTaskName);
    refreshSessions();
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Clock</IonTitle>
          <IonButtons slot="end">
              <IonButton onClick={() => setDate(date.minus({days: 1}))}>
                <IonIcon slot="icon-only" name="chevron-back"/>
              </IonButton>
              <IonLabel>
                {DateTime.fromISO(`${date}`).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
              </IonLabel>
              <IonButton onClick={() => setDate(date.plus({days: 1}))} disabled={date.startOf('day') >= now.startOf('day')}>
                <IonIcon slot="icon-only" name="chevron-forward"/>
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Task Clock
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {taskShortcuts.filter((task: string) => {
          return !sessions.find((s) => task === s.task);
        }).map((task: string) => (
          <IonButton key={`shortcut_${task}`} onClick={() => handleTaskClick(task)}>{task}</IonButton>
        ))}

        <IonList>
          <form onSubmit={(e) => {e.preventDefault(); handleStartNewTask(); return false;}}>
            <IonItem>
              <IonInput value={newTaskName} type="text" onIonInput={(e: any) => setNewTaskName(e.target.value)}/>
              <IonButton type='submit' slot="end" disabled={!newTaskName}>
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
