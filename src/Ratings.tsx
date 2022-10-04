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

const Ratings = () => {
	const _ratings = useGetAll("rating") as Array<{id: string, registration: string, ratings: string, createdAt: string, comment: string}>
	const regs = useGetAll("registration") as Array<{id: string, name: string, email: string, phone: string, createdAt: string}>
	const talks = useGetAll("talk") as Array<{id: string, title: string, description: string, createdAt: string}>

	/*
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
	*/
	//console.log(attendances)
	/*
	const sql = attendances.reduce((acc, a) => {
		const date = a.date
		const path = a.path
		return `${acc}\nINSERT INTO log (registration, date, path) VALUES (${a.id}, '${date.replace("T", " ").slice(0, 19)}', '${path}');`
	}, "")

	console.log(sql)
	*/
	const ratings = _ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	const comments = [] as Array<{comment: string, registration: string}>
	const allRatings = {} as Record<string, {sum: number, count: number, talk?: {id: string, title: string}}>

	const regIds = Array.from(new Set(...[ratings.map(r => r.registration)]))
	const lastRatings = regIds.map(rId => ratings.find(r => r.registration === rId))

	lastRatings.map(r => {
		if (!r) return
		if (r.comment) comments.push({comment: r.comment, registration: r.registration})
		const _rs = JSON.parse(r.ratings)
		Object.keys(_rs).map(talkId => {
			if (!allRatings[talkId]) allRatings[talkId] = {sum: 0, count: 0, talk: talks.find(t => t.id === talkId)}
			allRatings[talkId].sum += _rs[talkId]
			allRatings[talkId].count += 1
		})
	})


	return <>
			<b>{lastRatings.length}</b> beküldött értékelés


			<Box sx={{width: 'auto', mt: 2}}>
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{fontWeight: 700}}>Előadás</TableCell>
							<TableCell sx={{fontWeight: 700, textAlign: "right"}}>Értékelések száma</TableCell>
							<TableCell sx={{fontWeight: 700, textAlign: "right"}}>Átlag</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(allRatings).map(k => <TableRow key={k} hover>
							<TableCell>{allRatings[k].talk?.title || k}</TableCell>
							<TableCell sx={{textAlign: "right"}}>{allRatings[k].count}</TableCell>
							<TableCell sx={{textAlign: "right"}}>{Number(allRatings[k].sum/allRatings[k].count).toFixed(2)}</TableCell>
						</TableRow>)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>

		<Box sx={{mt: 4}}><b>{comments.length}</b> szöveges értékelés</Box>


		{comments.map(c => <Card sx={{my: 2}}>
			<CardContent>
				<Typography variant="h6" sx={{fontSize: 14, color: 'rgba(0,0,0,0.6)'}}>{regs.find(r => r.id == c.registration)?.name} ({c.registration})</Typography>
				<Typography variant="body1">{c.comment}</Typography>
			</CardContent>
		</Card>)}
	</>
}

export default Ratings