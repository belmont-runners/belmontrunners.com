import * as Admin from 'firebase-admin'
import {User} from './User'
import calc from './membershipUtils'

import {filter, resolve} from 'bluebird'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

const MEMBERSHIP_EXPIRES_SOON_DAYS = 14
const REMINDER_DAYS = 11

const SendMembershipReminders = (admin: Admin.app.App) => {
  const firestore = admin.firestore();

  async function wasEmailSent(user: User) {
    const docs = await firestore.collection('mail')
        .where("toUids", "array-contains", user.uid)
        .where("template.name", "==", "membershipExpiresSoon")
        .where("delivery.startTime", ">", dayjs().subtract(REMINDER_DAYS, 'day').toDate())
        .where("delivery.startTime", "<", dayjs().toDate())
        .get()
    return !docs.empty
  }

  async function sendEmail(user: User) {
    console.log('sendEmail called.  User:', user.uid)

    return await firestore.collection('mail').add({
      toUids: [user.uid],
      bcc: 'membership@belmontrunners.com',
      template: {
        name: "membershipExpiresSoon",
        data: {
          displayName: user.displayName,
          expirationDate: dayjs(user.membershipExpiresAt).format('dddd, MMMM Do YYYY'),
        },
      },
    })
  }


  // main function
  return async () => {

    const usersCollection: FirebaseFirestore.QuerySnapshot = await firestore.collection('users').get()
    const users: any[] = [];

    usersCollection.forEach((userDoc) => {
      const user = userDoc.data();
      user.uid = userDoc.id;
      users.push(user);
    });

    return filter(users, (user: User) => {
      const isMembershipExpiresSoon = calc(user, MEMBERSHIP_EXPIRES_SOON_DAYS, 'day').isMembershipExpiresSoon
      console.log('user.uid:', user.uid,
          ', MEMBERSHIP_EXPIRES_SOON_DAYS:', MEMBERSHIP_EXPIRES_SOON_DAYS,
          ', isMembershipExpiresSoon:', isMembershipExpiresSoon)
      return isMembershipExpiresSoon
    })
        .filter((user: User) =>
            resolve(wasEmailSent(user))
                .tap((wasSent: boolean) => console.log('user.uid:', user.uid,
                    ', REMINDER_DAYS:', REMINDER_DAYS,
                    ', wasEmailSent:', wasSent))
                .then((wasSent: boolean) => !wasSent))
        .each(sendEmail)
  }
}

export default SendMembershipReminders
