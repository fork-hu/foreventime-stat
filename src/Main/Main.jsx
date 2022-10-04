import Info from '../sections/Info/Info'
import Map from '../sections/Map/Map'
import Overlay from '../sections/Overlay/Overlay'
import Presenters from '../sections/Presenters/Presenters'
import Registration from '../sections/Registration/Registration'
import Schedule from '../sections/Schedule/Schedule.jsx'
import Sponsors from '../sections/Sponsors/Sponsors'
import Welcome from '../sections/Welcome/Welcome'
import './Main.scss'

const Main = () => {
	return (
		<main>
			<Welcome />
			<Overlay />
			<Info />
			<Presenters />
			<Schedule />
			<Map />
			<Sponsors />
			<Registration />
		</main>
	)
}

export default Main