import { store } from '../reducers';

export const findUserEmailById = (id) => {
	const workers = store.getState().worker.data
	const listSubs = workers.data.find(wk => wk.type == 'subscriptions')
	let email = ''

	const foundUser = listSubs.data.find(sub => sub.id == id)

	email = foundUser.info.email
	const info = {
		email,
		account_id: foundUser.info.account_id
	}
	return info

}