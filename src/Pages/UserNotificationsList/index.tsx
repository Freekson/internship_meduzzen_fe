import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Store/store";
import styles from "./UserNotificationsList.module.scss";
import Button from "../../Components/Button";
import { readNotification } from "../../Api/user";
import { toast } from "react-toastify";
import { markAsRead } from "../../Store/user/slice";

const UserNotificationsList = () => {
  const { notifications } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const handleRead = async (user_id: number, notification_id: number) => {
    try {
      await readNotification(user_id, notification_id);
      dispatch(markAsRead({ notification_id }));
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };
  return (
    <Layout>
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <div className={styles.notifications}>
        <h1>Notifications</h1>
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.notification_id}
              className={notification.is_read ? styles.read : styles.unread}
            >
              <div className={styles.notification_info}>
                <h2>{notification.notification_title}</h2>
                <p>{notification.notification_message}</p>
                <p>{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.is_read && (
                <Button
                  text="Mark as read"
                  variant="primary"
                  type="button"
                  onClick={() => {
                    handleRead(
                      notification.notification_user_id,
                      notification.notification_id
                    );
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default UserNotificationsList;
