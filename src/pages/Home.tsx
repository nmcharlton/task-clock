import SessionListItem from '../components/SessionListItem';
import { useState } from 'react';
import { Session } from '../models';
import { getSessions, startSession, endSession } from '../data/sessions';
import {
  IonContent,
  IonHeader,
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
  const [now, setNow] = useState<DateTime>(DateTime.now());

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

  const refreshSessions = () : Promise<void> => {
    return getSessions().then((data) => {
      setSessions(data.sort((a: Session, b: Session)=> {
        if (!a.end) return -1;
        if (!b.end) return 1;
        if (a.end > b.end) return -1;
        return 1;
      }));
    });
  }

  const handleSessionClick = (session : Session) => {
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
          {sessions.map(s => <SessionListItem key={s.id} session={s} now={now} onClick={() => handleSessionClick(s)} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
