import {
  IonItem,
  IonLabel,
  IonNote
  } from '@ionic/react';
import { Session } from '../models';
import './SessionListItem.css';
import { DateTime } from 'luxon';

interface SessionListItemProps {
  session: Session;
  now: DateTime;
  onClick(): void;
}

const SessionListItem: React.FC<SessionListItemProps> = ({ session, now, onClick }) => {
  const live = !session.end;
  const duration = (live ?
    now :
    DateTime.fromISO(`${session.date}T${session.end}`)
  ).diff(DateTime.fromISO(`${session.date}T${session.start}`));

  return (
    <IonItem button={true} onClick={onClick} detail={false} className={live ? 'live' : ''}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {session.task} &#8226; {duration.toFormat(`h'h' m'm' s's'`)}
          <span className="date">
            <IonNote>{DateTime.fromISO(`${session.date}`).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</IonNote>
          </span>
        </h2>
        <h3>{DateTime.fromISO(`${session.start}`).toFormat('HH:mm')}</h3>
      </IonLabel>
    </IonItem>
  );
};

export default SessionListItem;
