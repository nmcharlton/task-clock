import {
  IonItem,
  IonLabel,
  IonNote
} from '@ionic/react';
import { Session } from '../models';
import './SessionListItem.css';
import { DateTime, Duration } from 'luxon';

interface SessionListItemProps {
  sessions: Session[];
  now: DateTime;
  onClick(): void;
}

const SessionListItem: React.FC<SessionListItemProps> = ({ sessions, now, onClick }) => {
  const lastSession = sessions[0];
  const duration = sessions.reduce((totalDuration, session) => {
    const live = !session.end;
    return totalDuration.plus((
      live ? now : DateTime.fromISO(`${session.date}T${session.end}`)
    ).diff(DateTime.fromISO(`${session.date}T${session.start}`)));
  }, Duration.fromMillis(0));

  let reverseSessions = sessions.slice();
  reverseSessions.reverse();

  return (
    <IonItem button={true} onClick={onClick} detail={false} className={lastSession.end ? '' : 'live'}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {lastSession.task} &#8226; {duration.toFormat(`h'h' m'm' s's'`)}
          <span className="date">
            <IonNote>{DateTime.fromISO(`${lastSession.date}`).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</IonNote>
          </span>
        </h2>
        <h3>
          {reverseSessions.map((s) => (
            <span key={s.id}>
              <IonNote>{DateTime.fromISO(`${s.start}`).toFormat('HH:mm')}-{s.end && DateTime.fromISO(`${s.end}`).toFormat('HH:mm')}</IonNote>
            </span>
          ))}
        </h3>
      </IonLabel>
    </IonItem>
  );
};

export default SessionListItem;
