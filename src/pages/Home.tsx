import MessageListItem from '../components/MessageListItem';
import { useState } from 'react';
import { Session } from '../models';
import { getSessions } from '../data/sessions';
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

const Home: React.FC = () => {

  const [sessions, setSessions] = useState<Session[]>([]);

  useIonViewWillEnter(() => {
    getSessions().then((data) => {
      setSessions(data);
    });
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
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
          {sessions.map(s => <MessageListItem key={s.id} message={s} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
