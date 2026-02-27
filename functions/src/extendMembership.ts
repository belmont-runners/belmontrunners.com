import * as Admin from 'firebase-admin'
import { User } from './User'
import calc from './membershipUtils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(utc)
dayjs.extend(customParseFormat)

const ExtendMembership = (admin: Admin.app.App) => {
  const firestore = admin.firestore()
  return async () => {

    const usersCollection: FirebaseFirestore.QuerySnapshot = await firestore.collection('users').get()
    const users: User[] = []
    const promises: any[] = []
    usersCollection.forEach((userDoc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const user = userDoc.data()
      users.push(user as User)
    })

    users.forEach((user: User) => {
      if (!calc(user).wasNeverAMember) {
        promises.push(firestore.doc(`users/${user.uid}`).set(
          {membershipExpiresAt: dayjs("07-01-2021", "MM-DD-YYYY").utc().format()}, {merge: true}
        ))
      }
    })
    return await Promise.all(promises)
  }
}

export default ExtendMembership
