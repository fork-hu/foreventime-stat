/* import styled from "styled-components" */
import  {useStatQuery, useGetAll} from "./tools/datoCmsTools"
import { CSVLink } from "react-csv"
import {Button as MuiButton} from "@mui/material"
import { styled } from '@mui/system'

const StatPage = () => {
	//const [onsite, online, all] = useStatQuery("onsite")
	
		
	const stages = useGetAll("stage")
	const registrations = useGetAll("registration")
	console.log("registrations", registrations)
	const onsite = registrations.filter(r => r.onsite)
	const online = registrations.filter(r => (!(r.onsite)))
	
	const registrationsForExport = registrations?.map(registration => {
		const {id, name, email, phone, workplace, title, onsite, stage, vipCode, registrationFeedback, translation, createdAt} = registration
		return {id, name, email, phone, workplace, title, onsite, stage, vipCode, registrationFeedback, translation, createdAt}
	})

	const numberOfRegistrationFeedback = registrationsForExport.filter((registration) => registration.registrationFeedback ).length
	const numberOfTranslation = registrationsForExport.filter((registration) => (registration.translation)  ).length
	const numberOfCancellation = registrationsForExport.filter((registration) => (registration.registrationFeedback) &&  (!registration.onsite)).length

	const headers = [
		{ label: "id", key: "id" },
		{ label: "name", key: "name" },
		{ label: "email", key: "email" },
		{ label: "phone", key: "phone" },
		{ label: "workplace", key: "workplace" },
		{ label: "title", key: "title" },
		{ label: "onsite", key: "onsite" },
		{ label: "stage", key: "stage" },
		{ label: "vipCode", key: "vipCode" },
		{ label: "registrationFeedback", key: "registrationFeedback" },
		{ label: "translation", key: "translation" },
		{ label: "createdAt", key: "createdAt" },
	  ]
	console.log("registrationsForExport", registrationsForExport)
	const breakoutSessions = (stages.map(stage => {
		const regs = registrations?.filter((reg) => reg.stage===`${stage.id}`)
		return {name: stage.name, numberOfRegistration: regs.length}
	}))
	
	const onsiteBreakoutSessions = breakoutSessions.filter(bs => bs.numberOfRegistration>0)

	const csvReport = {
		data: registrationsForExport,
		headers: headers,
		filename: 'edunext2022_jelentkezesek.csv'
	  };
	
	return (
		<>
			<div>??sszes regisztr??ci??: {registrations?.length}</div>
			<div>Regisztr??ci?? online r??szv??telre: {online?.length}</div>
			<div>Regisztr??ci?? helysz??ni r??szv??telre: {onsite?.length ?? "0"}</div>
			<div>&nbsp;</div>
			{onsiteBreakoutSessions?.map((breakoutSession) => <div>{breakoutSession.name}: {breakoutSession.numberOfRegistration} </div> )}
			<div>&nbsp;</div>
			<div>Helysz??ni r??sztvev?? visszajelz??s: {numberOfRegistrationFeedback}</div>
			<div>Ebb??l ennyi a lemond??s: {numberOfCancellation}</div>
			<div>Tolm??csol??st k??r: {numberOfTranslation}</div>
			<CSVLink {...csvReport} separator=";" style={{textDecoration:"none"}}><Button variant="outlined">Export??l??s CSV f??jlba</Button></CSVLink>
		</>
	)
}

const Button = styled(MuiButton)(
	{
		width: "250px",
		textDecoration: "none",
		marginTop: "20px"
	}
)
	



export default StatPage