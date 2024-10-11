"use client";

import { useEffect, useState } from 'react';
import {fetcher} from "@public-src";
import useSWR from 'swr';
import moment from "moment"

import Stack from '@mui/material/Stack';
import BoxWithIcon from './components/BoxWithIcon';
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"

import { Events, Event, GameMode, GameModeAPI } from './types/types';
import lightenColor from "./utils"

interface EventsPerDay {
	[key: string]: Events
}

interface EventsData {
	data: EventsPerDay;
	lastUpdate: string
}

function useGameModes(shouldFetch: boolean) {
	const {data, error, isLoading} = useSWR(
		shouldFetch ? ["https://api.brawlify.com/v1/gamemodes", {method: "GET",}] : null, 
		([url, options]: [string, RequestInit]) => fetcher(url, options)
	)

	return {data}
}

function getURL() {
	const today = new Date()
	const year = today.getFullYear()
	const monthNumber = today.getMonth() + 1
	const monthName = today.toLocaleString('default', { month: 'long' }).toLowerCase()
	return `https://raw.githubusercontent.com/Victorsitou/brawlstars-events/refs/heads/web-2/${year}/${monthNumber}/${monthName}.json`;
}

export default function Home() {
	const [shouldFetchEvents, setShouldFetchEvents] = useState<boolean>(true)
	const [events, setEvents] = useState<EventsData>({data: {}, lastUpdate: ""})
	const {data: eventsData, error: eventsError, isLoading: eventsIsLoading} = useSWR(
		shouldFetchEvents
		? [getURL(), {
			method: "GET",
		}]
		: null,
		([url, options]: [string, RequestInit]) => fetcher(url, options)
	)

	if(eventsData) {
		setEvents(eventsData);
		setShouldFetchEvents(false);
	}

	const [shouldFetchGameModes, setShouldFetchGameModes] = useState<boolean>(true)
	const [gameModes, setGameModes] = useState<GameModeAPI[]>([])
	const {data: gameModesData} = useGameModes(shouldFetchGameModes)
	if (gameModesData) {
		setGameModes(gameModesData["list"])
		setShouldFetchGameModes(false)
	}

	console.log(gameModes)

	const groupedGameMode: GameModeAPI[][] = gameModes.reduce((result, item, index) => {
		if (index % 2 === 0) {
		  result.push([item]);
		} else {
		  result[result.length - 1].push(item);
		}
		return result;
	}, [] as GameModeAPI[][])
	

	const [selectedGameMode, setSelectedGameMode] = useState<string>("")
	const [selectedGameModeEvents, setSelectedGameModeEvents] = useState<Event[]>([])
	useEffect(() => {
		if (selectedGameMode) {
			const eventsGameMode: Event[] = []
			for(const dia in events.data) {
				events.data[dia].active.forEach(activeEvent => {
					if (activeEvent.map.gameMode.hash == selectedGameMode) {
						eventsGameMode.push(activeEvent)
					}
				});
			}
			setSelectedGameModeEvents(eventsGameMode)
		} else {
			setSelectedGameModeEvents([])
		}
	}, [selectedGameMode])

	return (
		<>
			<div style={{marginTop: "6vh", marginBottom: "5vh", textAlign: "center"}}>
				<h1>Welcome to Brawl Stars Events.</h1>
				<p>Please be aware that events could not be up to date.</p>
				<p>Last update: {moment(events.lastUpdate).format("D-M-YYYY HH:mm")}</p>
			</div>
			{selectedGameMode === ""
			? <div style={{
				display: "flex",
				justifyContent: "center",
				height: "100vh",
				marginTop: "20px", 
				marginBottom: "20px"
			}}>
				<h1>{selectedGameMode}</h1>
				<Stack spacing={2}>
					{groupedGameMode.map((group, index) => (
						<Stack key={index} direction="row" spacing={2}>
							{group.map((gameMode, i) => (
								<BoxWithIcon 
									iconUrl={gameMode.imageUrl} 
									text={gameMode.name} 
									boxSx={{
										flexGrow: 1,
										textAlign: "center",
										backgroundColor: gameMode.bgColor,
										padding: 2,
										":hover": {
											backgroundColor: lightenColor(gameMode.bgColor, 0.3)
										}
									}}
									typographySX={{
										fontSize: "20px"
									}}
									onClick={() => {setSelectedGameMode(gameMode.hash)}}
								/>
							))}
						</Stack>
					))}
				</Stack>
			</div>
			: <div style={{
				display: "flex",
				justifyContent: "center",
				justifyItems: "center"
				}}>
					<Stack spacing={2}>
						<Button variant="contained" onClick={() => {setSelectedGameMode("")}}>Back</Button>
						{selectedGameModeEvents.length > 0 
						? selectedGameModeEvents.map((event, index) => (
							<Box>
								<Stack direction="row">
									<Link href={event.map.link} target="_blank" rel="noopener noreferrer">{event.map.name} </Link>
									<p>&nbsp;- {moment(event.startTime).format("D-M-YYYY HH:mm")} to {moment(event.endTime).format("D-M-YYYY HH:mm")}</p>
								</Stack>
							</Box>
						))
						: <p>No data is available.</p>}
					</Stack>
			   </div>
			}
		</>
	);
}
