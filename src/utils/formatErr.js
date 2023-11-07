import i18next from "i18next";
import { externalLink } from "../data/constant";

export function formatError(err = 'Something went wrong!', code = '0') {

	const suggestMsg = i18next.t("error.suggest");
	const directDiscordMsg = ` Join <a target='_blank' href=${externalLink.DISCORD_LINK}>Thinkmay Discord</a> for support.`;

	let msg

	const CAUSES = {
		"0": err,
		"1": i18next.t("error.run_out_of_gpu_stock"),
		"2": i18next.t("error.ALREADY_DEPLOYED"),
		"3": "INVALID_AUTH_HEADER",
		"4": "DATABASE_ERROR",
		"5": i18next.t("error.NOT_FOUND"),
		"6": i18next.t("error.TIME_OUT"),
	}


	msg = CAUSES[code] ?? err
	if (err.includes('ran out of hardware') || err.includes('ran out of gpu')) {
		msg = i18next.t("error.run_out_of_gpu_stock")
	}
	if (err.includes('is locked')) {
		msg = i18next.t("error.IS_LOCKED")
	}
	const template = `<p> <b class='uppercase'>${msg}. </b>
						${suggestMsg}
						</br> 
						${directDiscordMsg} 
					  <p>`



	return template
}