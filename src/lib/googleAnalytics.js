import ReactGA from "react-ga";

const useAnalyticsEventTracker = ({ category, action, value }) => {
	ReactGA.event({ category, action, value });
}
export default useAnalyticsEventTracker;