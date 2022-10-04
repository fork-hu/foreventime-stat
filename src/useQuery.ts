import { useContext, useEffect, useState } from "react"
import { useQuerySubscription } from "react-datocms"

export type QueryError = {
	code: string
	message: string
	fatal: boolean
}

const useQuery = <T>(query: string, token: string, initialValue: T) : [T, QueryError | null] => {
	const [result, setResult] = useState<T>(initialValue)

	const { data, error } = useQuerySubscription({
		query,
		enabled: Boolean(token),
		token,

	})
	useEffect(() => {
		if (data) setResult(Object.keys(data).length === 1 ? data[Object.keys(data)[0]] : data)
	}, [data])
	useEffect(() => {
		setResult(initialValue)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query])
	return [result, error]
}


export default useQuery