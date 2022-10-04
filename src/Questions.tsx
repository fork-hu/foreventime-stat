import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CardContent, Card, Typography, Stack, Grid, FormControl, InputLabel, Select, MenuItem, Divider, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useGetAll } from "./tools/datoCmsTools"
import useQuery from "./useQuery"

const formatDate = (date: string|Date) => {
	const d = new Date(date)
	return d.toLocaleTimeString('hu-HU', {
		hour: "2-digit",
		minute: "2-digit",
	})
}

const Questions = () => {
	
	const stages = useGetAll("stage") as any[]
	const talks = useGetAll("talk") as any[]
	const speakers = useGetAll("speaker") as any[]
	const [selectedStage, setSelectedStage] = useState<number|null>(null)
	const [selectedTalk, setSelectedTalk] = useState<number|null>(null)

	return <>
		{/* <FormControl fullWidth>
			<InputLabel>Szekció</InputLabel>
			<Select
				value={selectedStage}
				label="Szekció"
				onChange={(e) => setSelectedStage(e.target.value as number)}
			>
				{ stages.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) }
			</Select>
		</FormControl> */}

		<FormControl fullWidth sx={{my: 4}}>
			<InputLabel>Előadás</InputLabel>
			<Select
				value={selectedTalk}
				label="Szekció"
				onChange={(e) => setSelectedTalk(e.target.value as number)}
			>
				{ talks.filter(t=>t.speaker.length > 0).sort((a,b) => (new Date(a.start).getTime()) - (new Date(b.start).getTime())).map(s => <MenuItem key={s.id} value={s.id}>
					{s.title} ({ s.speaker.map((sid: any) => speakers.find(s => s.id === sid)).map((s: any) => s?.name).join(", ") })
				</MenuItem>) }
			</Select>
		</FormControl>

		{selectedTalk && <ShowQuestions selectedTalk={selectedTalk} />}
		
	</>
}

const ShowQuestions = (props: {selectedTalk: number}) => {
	const [questions] = useQuery(`
	query {
		allQuestions(filter: {talk: {eq: "${props.selectedTalk}"}}) {
		  content
		  createdAt
		  registration {
			name
		  }
		  talk {
			id
		  }
		  speaker {
			id
			name
		  }
		}
	  }
	`, "3331fc3477e7df4b7cb85836c2a684", [])

	return <>
	<Button variant="contained" color="primary" sx={{mb: 3}} onClick={() => document.getElementById("questions")?.requestFullscreen()}>
		Teljes képernyő
	</Button>
	<Box id="questions" sx={{backgroundColor: '#47CCD4', p: 2, overflow: 'auto'}}>
		{ questions.sort((a: any,b: any) => (new Date(a.createdAt).getTime()) - (new Date(b.createdAt).getTime())).map((q: any) => <Card sx={{mb: 2}}>
			<CardContent>
				<Typography variant="h6" sx={{fontSize: 15, color: 'rgba(0,0,0,0.5)'}}>Feladó: {q?.registration?.name || "Névtelen kérdező"} • Címzett: {q?.speaker?.name || "Nincs"} • {formatDate(q.createdAt)}</Typography>
				<Typography variant="body1" sx={{fontSize: 19, mt: 1}}>{q?.content}</Typography>
			</CardContent>
		</Card>) }
	</Box>
	</>
}



export default Questions