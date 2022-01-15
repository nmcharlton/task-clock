import {
  IonItem,
  IonLabel,
  IonNote
  } from '@ionic/react';
import { Session } from '../models';
import './MessageListItem.css';

interface MessageListItemProps {
  message: Session;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <IonItem routerLink={`/message/${message.id}`} detail={false}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.start_time}
          <span className="date">
            <IonNote>{message.end_time}</IonNote>
          </span>
        </h2>
        <h3>{message.task}</h3>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
