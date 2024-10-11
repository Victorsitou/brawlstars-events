"use client";

import { useEffect, useState } from 'react';
import {fetcher} from "@public-src" ;
import useSWR from 'swr';
import lightenColor from "./utils"
import moment from "moment"

import Stack from '@mui/material/Stack';
import BoxWithIcon from './components/BoxWithIcon';
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

function getGameModes(events) {
	const gameModesMap = new Map();

	for(const dia in events){
		events[dia].active.forEach(event => {
			const gameMode = event.map.gameMode;
			if (gameMode && !gameModesMap.has(gameMode.id)) {
				gameModesMap.set(gameMode.id, gameMode);
			}
		});
	}
  
	return [...gameModesMap.values()];
}

function getURL() {
	const today = new Date()
	const year = today.getFullYear()
	const monthNumber = today.getMonth() + 1
	const monthName = today.toLocaleString('default', { month: 'long' }).toLowerCase()
	return `https://raw.githubusercontent.com/Victorsitou/brawlstars-events/refs/heads/web/${year}/${monthNumber}/${monthName}.json`;
}

export default function Home() {
	const [shouldFetchEvents, setShouldFetchEvents] = useState<boolean>(true)
	const [events, setEvents] = useState([])
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


	const groupedGameMode = getGameModes(events).reduce((result, item, index) => {
		if (index % 2 === 0) {
		  result.push([item]);
		} else {
		  result[result.length - 1].push(item);
		}
		return result;
	}, [])
	

	const [selectedGameMode, setSelectedGameMode] = useState(null)
	const [selectedGameModeEvents, setSelectedGameModeEvents] = useState([])
	useEffect(() => {
		if (selectedGameMode) {
			const eventsGameMode = []
			for(const dia in events) {
				events[dia].active.forEach(activeEvent => {
					if (activeEvent.map.gameMode.id == selectedGameMode) {
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
			<h1 style={{marginTop: "25vh", marginBottom: "5vh", textAlign: "center"}}>Welcome to Brawl Stars Events.</h1>
			{selectedGameMode === null
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
									onClick={() => {setSelectedGameMode(gameMode.id)}}
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
						<Button variant="contained" onClick={() => {setSelectedGameMode(null)}}>Back</Button>
						{selectedGameModeEvents.map((event, index) => (
							<Box>
								<Stack direction="row">
									<p>{event.map.name} - {moment(event.startTime).format("D-M-YYYY HH:mm")} to {moment(event.endTime).format("D-M-YYYY HH:mm")}</p>
								</Stack>
							</Box>
						))}
					</Stack>
			   </div>
			}
		</>
	);
}
