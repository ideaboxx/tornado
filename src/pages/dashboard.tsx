import {
	Box,
	Heading,
	useBoolean,
	useBreakpointValue,
	useInterval,
	VStack
} from '@chakra-ui/react';
import Empty from '@components/Empty';
import Torrent from '@components/Torrent';
import axios from 'axios';
import Layout from 'layouts';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Dashboard() {
	const [torrents, setTorrents] = useState([]);
	const breakpt = useBreakpointValue({ base: 'base', md: 'md' });
	const [flag, setFlag] = useBoolean(true);
	const router = useRouter();

	useInterval(() => {
		axios
			.get('/api/listTorrents')
			.then(({ data }) => {
				setTorrents(data.torrents);
			})
			.catch((e) => {
				console.error(e);
				router.replace('/');
			})
			.finally(() => setFlag.off());
	}, 1000);

	return (
		<Layout>
			<div className={`${breakpt == 'md' ? 'p-7' : 'p-4'} overflow-y-auto`}>
				<Heading size={'md'} className='mb-4'>
					Active
				</Heading>
				<VStack align='stretch'>
					{torrents.map((t) => (
						<Torrent {...t} key={t.infoHash} />
					))}
					{torrents.length == 0 && (
						<Empty showSpinner={flag} placeholder='No active torrents' />
					)}
				</VStack>
			</div>
		</Layout>
	);
}
