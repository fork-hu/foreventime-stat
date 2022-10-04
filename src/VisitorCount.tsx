import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useGetAll } from "./tools/datoCmsTools"

type Attendance = {
	id: string,
	date: string,
	path: string,
}

const notOlderThan = (date: string, minutes: number) => {
	const now = new Date()
	const then = new Date(date)
	return now.getTime() - then.getTime() < minutes * 60 * 1000
}

const formatDate = (date: string|Date) => {
	const d = new Date(date)
	return d.toLocaleTimeString('hu-HU', {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	})
}

const VisitorCount = () => {
	const [refreshKey, setRefreshKey] = useState(0)
	const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(new Date())
	const _attendances = useGetAll("attendance", refreshKey)


	useEffect(() => {
		const interval = window.setInterval(() => {
			console.log("Refreshing")
			setRefreshKey(k => k + 1)
			setLastUpdatedAt(new Date())
		}, 1000 * 60 * 2)
		return () => window.clearInterval(interval)
	}, [])

	const last5Min = {} as Record<string, number>
	let last5MinCount = 0

	const attendances = _attendances.map((a: any) => {
		const list = JSON.parse(a.attendances) as {date: string, path: string}[]
		const last = list[list.length - 1]
		if (last && notOlderThan(last.date, 5)) {
			last5Min[last.path] = (last5Min[last.path] || 0) + 1
			last5MinCount += 1
		}
		return list.map((b: any) => ({id: a.registration, date: b.date, path: b.path}))
	}).flat() as Attendance[]

	const stages = {
		"/szekcio/plenaris": "Plenáris",
		"/szekcio/szakkepzes-itmp-netacad": "Szakkepzés, ITMP, Netacad",
		"/szekcio/digitalis-kultura": "Digitalis kultúra",
		"/szekcio/it-felsooktatas": "IT felsőoktatás",
		"/szekcio/digitalis-kultura-also-tagozat": "Digitalis kultúra alsó tagozat",
	} as Record<string, string>

	//console.log(attendances)
	/*
	const sql = attendances.reduce((acc, a) => {
		const date = a.date
		const path = a.path
		return `${acc}\nINSERT INTO log (registration, date, path) VALUES (${a.id}, '${date.replace("T", " ").slice(0, 19)}', '${path}');`
	}, "")

	console.log(sql)
	*/
	return <>
		{_attendances.length} jelentkezett már be - {attendances.length} log bejegyzés

		<Box sx={{mb: 2}}><b>{last5MinCount} aktív néző</b> (utolsó 5 percben)</Box>

		<Box sx={{mb: 2}}>Utoljára frissítve: {lastUpdatedAt ? formatDate(lastUpdatedAt).slice(0,5) : null}</Box>

		<Grid container spacing={2} sx={{mb: 4}}>
			{Object.keys(stages).map((k, i) => <Grid item xs>
				<Card key={i} sx={{height: '100%'}}>
					<CardContent>
						<Typography sx={{ fontSize: 14 }} gutterBottom>
							{stages[k]}
						</Typography>
						<Typography variant="h5" component="div">
							<b>{last5Min[k] || 0}</b> <span style={{fontSize: 20, fontWeight: 500}}>néző</span>
						</Typography>
					</CardContent>
				</Card>
			</Grid>)}
		</Grid>

		<Box sx={{width: '600px'}}>
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{fontWeight: 700}}>URL</TableCell>
							<TableCell sx={{fontWeight: 700, textAlign: "right"}}>Nézőszám (5 min)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(last5Min).map(k => <TableRow key={k}>
							<TableCell>{k}</TableCell>
							<TableCell sx={{textAlign: "right"}}>{last5Min[k]}</TableCell>
						</TableRow>)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	</>
}

export default VisitorCount