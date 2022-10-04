const mysql = require('mysql')

const connection = mysql.createConnection({
	  host: "localhost",
	  user: "ws",
	  password: "ws",
	  database: "iok-livr",
	  insecureAuth: true
})


const query = (conn, sql) => {
	return new Promise((resolve, reject) => {
		conn.query(sql, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

const main = async () => {
	connection.connect()

	const timestamps = (await query(connection, `
		SELECT
			unix_timestamp(date) - unix_timestamp(date) mod 300 as ts
		FROM log
		WHERE date > '2022-03-19 05:00:00' AND date < '2022-03-19 19:00:00'
		GROUP BY ts;
	`)).map(r => r.ts)

	const sections = ["/szekcio/plenaris", "/szekcio/szakkepzes-itmp-netacad", "/szekcio/digitalis-kultura", "/szekcio/digitalis-kultura-also-tagozat", "/szekcio/it-felsooktatas"]

	const data = await Promise.all(timestamps.map(async ts => {
		const res = await Promise.all(sections.map(path => query(connection, `SELECT COUNT (*) AS c, "${path}" AS path FROM (SELECT DISTINCT registration FROM log WHERE path = "${path}" AND unix_timestamp(date) >= ${ts} AND unix_timestamp(date) < (${ts}+300)) t`)))
		return {ts, counts: res.map(r=>r[0].c)} //`${ts};${new Date(ts*1000).toLocaleString('hu-HU')};${res[0].c}`
	}))
	console.log(`timestamp;date;${sections.join(';')}`)
	data.sort((a, b) => a.ts - b.ts).map(r => console.log(`${r.ts};${new Date(r.ts*1000).toLocaleString('hu-HU')};${r.counts.join(";")}`))

	connection.end();
}

main()